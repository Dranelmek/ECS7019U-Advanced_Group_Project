import base64
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from PIL import Image
from torch.utils.data import DataLoader, TensorDataset
import argparse
import pytesseract  # uses https://github.com/UB-Mannheim/tesseract/wiki
import cv2
import matplotlib.pyplot as plt
import re
import os
import json
import io


def get_gps(frame):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    window = frame[875:975, 35:600]
    _, window = cv2.threshold(window, 200, 255, cv2.THRESH_BINARY)

    text = pytesseract.image_to_string(window)

    last_line = text.splitlines()[-1]
    numeric_values = re.findall(r'[-+]?\d*\.\d+|\d+', last_line)

    gps_n = float(".".join(numeric_values[0:2]))
    gps_e = float(".".join(numeric_values[2:4]))
    speed = int(numeric_values[-1])
    if len(numeric_values) != 5:
        speed = 0

    # return GPS N, GPS E, Speed
    return gps_n, gps_e, speed


def get_prediction(frame, resnet):
    # IMAGE PREPROCESS
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    img = Image.fromarray(frame)
    input_tensor = preprocess(img)
    input_batch = input_tensor.unsqueeze(0)
    # print("Input tensor shape:", input_batch.shape)

    # RUNNING
    with torch.no_grad():
        output = resnet(input_batch)
        predicted_index = torch.argmax(output, dim=1)

    # 1 pothole 0 not pothole
    predicted_class = predicted_index.item()
    return predicted_class


def encode_frame_to_base64(frame):
    ret, buffer = cv2.imencode('.jpg', frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    return frame_base64


def create_video_from_frames(frames, output_path, fps):
    frame_height, frame_width, _ = frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    for frame in frames:
        out.write(frame)

    out.release()


def main(video_path):
    # VIDEO PROCESSING
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    processing_rate = 1
    frame_count = 0
    results = []

    # PARAMS
    pretrained_weights_path = 'fine_tuned_resnet_50'  # path to model

    # GPU
    if torch.cuda.is_available():
        device = torch.device("cuda")
        # print('Using GPU:', torch.cuda.get_device_name())
    else:
        device = torch.device("cpu")
        # print('Using CPU')

    # MODEL INIT
    resnet = models.resnet50()
    num_ftrs = resnet.fc.in_features
    resnet.fc = torch.nn.Linear(num_ftrs, 2)
    resnet.load_state_dict(torch.load(pretrained_weights_path))
    resnet.eval()

    while cap.isOpened():
        ret, frame = cap.read()
        predicted_class = 0
        gps_n = 0
        gps_e = 0
        speed = 0

        if not ret:
            break

        if frame_count % (frame_rate / processing_rate) == 0:
            # Get the GPS data and speed
            gps_n, gps_e, speed = get_gps(frame)
            predicted_class = get_prediction(frame, resnet)

            if predicted_class == 1:
                print("AAAAAAASFHNSBAAAAAAAAAAAAAAAAFLKABBFOJLSABOAAAAAAAAAAAAHLFBAOBSPBDOJASPDBN")
                image_base64 = encode_frame_to_base64(frame)

                frames_to_capture = int(frame_rate)  # number of frames in one second
                start_frame = max(0, frame_count - frames_to_capture)
                end_frame = min(total_frames, frame_count + frames_to_capture)

                captured_frames = []

                for i in range(start_frame, end_frame):
                    cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                    ret, captured_frame = cap.read()
                    if ret:
                        captured_frames.append(captured_frame)

                create_video_from_frames(captured_frames, f"output2\captured_frames_{frame_count}.mp4", frame_rate)

                results.append({
                    "frame": frame_count,
                    "class": 1,
                    "GPS": (gps_n, gps_e),
                    "img": image_base64,
                })

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
    return results


if __name__ == "__main__":
    output_directory = "output2"
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # USE ARGS
    # parser = argparse.ArgumentParser(description='Process video for ResNet classification')
    # parser.add_argument('video_path', metavar='video_path', type=str, help='Path to the video file')
    # args = parser.parse_args()
    # result = main(args.video_path)

    # USE SPECIFIC PATH
    result = main("20240204_202733F.ts")

    # OUTPUT
    output_file = r"output2\result.json"
    # Write the result to a JSON file
    with open(output_file, "w") as f:
        json.dump(result, f)

    print("Result saved to", output_file)
