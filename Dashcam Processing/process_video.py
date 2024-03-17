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


def get_gps(frame, window_dim):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    window = frame[window_dim]
    _, window = cv2.threshold(window, 200, 255, cv2.THRESH_BINARY)

    text = pytesseract.image_to_string(window)

    last_line = text.splitlines()[-1]
    numeric_values = re.findall(r'\d+', last_line)

    gps_n = float(".".join(numeric_values[0:2]))
    gps_e = float(".".join(numeric_values[2:4]))
    speed = int(numeric_values[-1])
    if len(numeric_values) != 5:
        speed = 0

    # return GPS N, GPS E, Speed
    return gps_n, gps_e, speed


def create_video_from_frames(frames, output_path, fps):
    frame_height, frame_width, _ = frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    for frame in frames:
        out.write(frame)

    out.release()


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


def main(video_path, upload):
    # VIDEO PROCESSING
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    processing_rate = 1
    frame_count = 0

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Check if the resolution is 1920x1080 (1080p)
    if width == 1920 and height == 1080:
        window_dim = (slice(940, 975), slice(35, 500))
    else:
        window_dim = (slice(2020, 2100), slice(50, 1000))

    # GPU
    if torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    # Model
    pt_file = "Yolo Model.pt"  # path to YOLO
    model = YOLO(pt_file)
    model.to(device)
    min_confidence = 0.3

    while cap.isOpened():
        ret, frame = cap.read()
        predicted_class = 0
        lat = 0
        long = 0
        speed = 0

        if not ret:
            break

        if frame_count % (frame_rate / processing_rate) == 0:
            print("checking this frame")
            # Get the GPS data and speed
            lat, long, speed = get_gps(frame, window_dim)
            yolo_result = model(source=frame, conf=min_confidence, show=False)  # run on YOLO

            # If pothole detected
            if yolo_result[0].boxes.data.numel() != 0:  # if the output sums to something other than 0 pothole detected
                print("Detected Pothole")

                time = datetime.datetime.now().strftime("%Y%m%d%H%M%S")

                yolo_result[0].save(fr"output_img\{time}{frame_count}.jpg")

                frames_to_capture = int(frame_rate)  # number of frames in one second
                start_frame = max(0, frame_count - frames_to_capture)
                end_frame = min(total_frames, frame_count + frames_to_capture)

                captured_frames = []

                for i in range(start_frame, end_frame):
                    cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                    ret, captured_frame = cap.read()
                    if ret:
                        captured_frames.append(captured_frame)

                create_video_from_frames(captured_frames, fr"output_vid\{time}{frame_count}.mp4", frame_rate)

                if upload:
                    location = f"{lat}; {long}"
                    image_file_name = f"{time}{frame_count}.jpg"
                    video_file_name = f"{time}{frame_count}.mp4"
                    image_path = fr"output_vid\{time}{frame_count}.mp4"
                    video_path = fr"output_img\{time}{frame_count}.jpg"

                    print(location)
                    print(image_file_name)
                    print(video_file_name)
                    print(image_path)
                    print(video_path)

                    upload_pothole(location=location, repairment_needed=True, severe_level=3,
                                   image_file_name=image_file_name, video_file_name=video_file_name,
                                   image_path=image_path, video_path=video_path)

                    print("uploaded")

                    # delete_file(image_path)
                    # delete_file(video_path)

                else:
                    print("No pothole detected")

            # code to control number of frames captured per second depending on speed
            if speed > 90:
                processing_rate = 3  # Process 3 frames per second
            elif speed > 60:
                processing_rate = 2  # Process 2 frames per second
            else:
                processing_rate = 1  # Process 1 frame per second
        print(frame_count)
        frame_count += 1
    cap.release()


if __name__ == "__main__":
    output_directory_vid = "output_vid"
    output_directory_img = "output_img"
    if not os.path.exists(output_directory_vid):
        os.makedirs(output_directory_vid)
    if not os.path.exists(output_directory_img):
        os.makedirs(output_directory_img)

    # USE ARGS
    # parser = argparse.ArgumentParser(description='Process video')
    # parser.add_argument('video_path', metavar='video_path', type=str, help='Path to the video file')
    # args = parser.parse_args()
    # result = main(args.video_path, upload=True)

    # USE SPECIFIC PATH
    main("testVideo.ts", upload=False)
    delete_files_in_folder(output_directory_vid)
    delete_files_in_folder(output_directory_img)
