import numpy as np
import torch
import argparse
import pytesseract  # uses https://github.com/UB-Mannheim/tesseract/wiki
import cv2
import re
import os
from ultralytics import YOLO
import requests
import datetime
import time
from collections import deque
import sys


def delete_files_in_folder(folder_path):
    try:
        # List all files in the folder
        files = os.listdir(folder_path)

        # Iterate over each file and delete it
        for file_name in files:
            file_path = os.path.join(folder_path, file_name)
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"Deleted file: {file_path}")

        print("All files deleted successfully.")
    except Exception as e:
        print("Error deleting files:", e)


def upload_pothole(location, repairment_needed, severe_level, image_file_name, video_file_name, image_path, video_path):
    try:
        # Create FormData object
        formData = {
            'image': (image_file_name, open(image_path, 'rb'), 'image/jpeg'),  # Change to a unique file name
            'video': (video_file_name, open(video_path, 'rb'), 'video/mp4')
        }

        # Make a POST request to upload the files
        file_response = requests.post("http://localhost:8800/api/upload", files=formData)

        # Check the response
        if file_response.status_code == 200:
            print("Pothole created successfully")

            data = {
                'location': location,
                'image': image_file_name,
                'video': video_file_name,
                'repairment_needed': repairment_needed,
                'severe_level': severe_level
            }

            new_pothole_response = requests.post("http://localhost:8800/pothole/addNewPothole", json=data)

            if new_pothole_response.status_code == 200:
                print('Successfully uploaded new pothole')
            else:
                print("Error uploading pothole")
        else:
            print("Failed to create pothole. Status code:", file_response.status_code)

    except Exception as e:
        print("Error uploading files or creating pothole:", e)


def is_not_dark(frame):
    # Convert frame to grayscale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Calculate average pixel intensity
    average_intensity = cv2.mean(gray_frame)[0]
    # Define a threshold to distinguish between day and night images
    threshold = 60

    if average_intensity < threshold:
        return False
    else:
        return True


def get_gps(frame, window_dim):
    failed = False
    gps_n = 0
    gps_e = 0
    speed = 0

    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    window = frame[window_dim]
    _, window = cv2.threshold(window, 200, 255, cv2.THRESH_BINARY)

    text = pytesseract.image_to_string(window)
    try:
        last_line = text.splitlines()[-1]
        numeric_values = re.findall(r'\d+', last_line)

        gps_n = float(".".join(numeric_values[0:2]))
        gps_e = float(".".join(numeric_values[2:4]))
        speed = int(numeric_values[-1])
        if len(numeric_values) != 5:
            speed = 0
    except:
        failed = True
        print("failed")

    # return GPS N, GPS E, Speed
    return gps_n, gps_e, speed, failed


def create_video_from_frames(frames_queue, output_path, fps, frame_height, frame_width):
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    for frame_info in frames_queue:
        out.write(frame_info[0])

    out.release()


def to_video_and_upload(frames_queue, frame_rate, height, width, upload):
    target = frames_queue[frame_rate]
    target_name = target[1]
    target_location = target[2]
    vid_path = r"output_vid\\"
    img_path = r"output_img\\"
    if target_name:  # if there is a name for the frame it is a frame with a detected pothole
        create_video_from_frames(frames_queue, (vid_path + target_name + ".mp4"), frame_rate, height, width)
        cv2.imwrite(("img" + vid_path + target_name + ".jpg"), target[0])

        if upload:
            image_file_name = target_name + ".jpg"
            video_file_name = target_name + ".mp4"
            image_path = vid_path + target_name + ".mp4"
            video_path = img_path + target_name + ".jpg"

            print(target_location)
            print(image_file_name)
            print(video_file_name)
            print(image_path)
            print(video_path)

            upload_pothole(location=target_location, repairment_needed=True, severe_level=3,
                           image_file_name=image_file_name, video_file_name=video_file_name,
                           image_path=image_path, video_path=video_path)

            print("uploaded a frame")


def main(video_path, upload, to_video):
    # Testing
    failed_count = 0
    frames_checked = 0
    dark_count = 0

    # VIDEO PROCESSING
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_rate = round(cap.get(cv2.CAP_PROP_FPS))
    processing_rate = 1
    frame_count = 0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    num_saved_frames = int(frame_rate * 2) + 1
    frames_queue = deque(maxlen=num_saved_frames)

    for i in range(num_saved_frames):
        frames_queue.append([np.zeros((height, width, 3), dtype=np.uint8), "", ""])

    # Check if the resolution is 1920x1080 (1080p)
    if width == 1920 and height == 1080:
        window_ocr_dim = (slice(940, 975), slice(35, 500))
        window_detect_dim = (slice(620, 780), slice(576, 1344))
    else:
        window_ocr_dim = (slice(2020, 2100), slice(50, 1000))
        window_detect_dim = (slice(1296, 1728), slice(1152, 2688))

    # GPU
    if torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    # Model
    pt_file = "Yolo Model.pt"  # path to YOLO
    model = YOLO(pt_file)
    model.to(device)
    min_confidence = 0.55

    while cap.isOpened():
        ret, frame = cap.read()
        lat = 0
        long = 0
        speed = 0
        failed = False

        if not ret:
            break

        if frame_count % int(frame_rate / processing_rate) == 0:
            print("checking this frame")
            frames_checked += 1
            if is_not_dark(frame):
                # Get the GPS data and speed
                lat, long, speed, failed = get_gps(frame, window_ocr_dim)
                yolo_result = model(source=frame[window_detect_dim], conf=min_confidence, show=False)  # run on YOLO

                # If pothole detected (if the output sums to something other than 0 pothole detected) and not failed
                if (yolo_result[0].boxes.data.numel() != 0) and (not failed):
                    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
                    location = f"{lat}; {long}"
                    print("Detected Pothole")

                    frames_queue.append([frame, fr"{timestamp}{frame_count}", location])
                    yolo_result[0].save(fr"output_img\{timestamp}{frame_count}.jpg")

                else:
                    print("No pothole detected")
                    frames_queue.append([frame, "", ""])
            else:
                print("too dark for model")
                dark_count += 1
                frames_queue.append([frame, "", ""])

            # code to control number of frames captured per second depending on speed
            if speed > 90:
                processing_rate = 6  # Process 6 frames per second
            elif speed > 60:
                processing_rate = 4  # Process 4 frames per second
            else:
                processing_rate = 2  # Process 2 frame per second

            if failed:
                failed_count += 1
                processing_rate = frame_rate / 2
        else:
            frames_queue.append([frame, "", ""])

        if to_video:
            to_video_and_upload(frames_queue, frame_rate, height, width, upload)

        print(frame_count)
        frame_count += 1

    cap.release()

    for i in range(num_saved_frames):
        frames_queue.append([np.zeros((height, width, 3), dtype=np.uint8), "", ""])
        to_video_and_upload(frames_queue, frame_rate, height, width, upload)

    print("failed count:", failed_count)
    print("frames checked:", frames_checked)
    print("dark_count:", dark_count)

    return failed_count, frames_checked, dark_count


if __name__ == "__main__":

    output_directory_vid = "output_vid"
    output_directory_img = "output_img"
    if not os.path.exists(output_directory_vid):
        os.makedirs(output_directory_vid)
    if not os.path.exists(output_directory_img):
        os.makedirs(output_directory_img)

    failed_count_total = 0
    frames_checked_total = 0
    dark_count_total = 0

    # USE ARGS
    # parser = argparse.ArgumentParser(description='Process video')
    # parser.add_argument('video_path', metavar='video_path', type=str, help='Path to the video file')
    # args = parser.parse_args()
    # result = main(args.video_path, upload=False, to_video=True)

    # USE SPECIFIC PATH
    failed_count, frames_checked, dark_count = main("testVideo.ts", upload=False, to_video=True)
    failed_count_total += failed_count
    frames_checked_total += frames_checked
    dark_count_total += dark_count

    # files = os.listdir("dashcam_videos")
    # for file_name in files:
    #     video_path = os.path.join("dashcam_videos", file_name)
    #     print(video_path)
    #     failed_count, frames_checked, dark_count = main(video_path=video_path, upload=False, to_video=False)
    #     failed_count_total += failed_count
    #     frames_checked_total += frames_checked
    #     dark_count_total += dark_count

    print()
    print("failed count:", failed_count_total)
    print("frames checked:", frames_checked_total)
    # delete_files_in_folder(output_directory_vid)
    # delete_files_in_folder(output_directory_img)
