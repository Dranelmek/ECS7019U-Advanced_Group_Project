# ECS7019U-Advanced_Group_Project
## Dependencies
- Tesseract OCR https://github.com/UB-Mannheim/tesseract/wiki ver 5.3.3.20231005
- Node.js
- MongoDBCompass 

# How to use:
### To connect to the backend server
1. cd Backend
2. npm install
3. npm start

### To start to the frontend site (requires backend)
1. cd Frontend/councilsite
2. npm install
3. npm start

### To run the pipeline (upload requires backend)
Install python packages:
- numpy
- torch
- pytesseract
- cv2
- re
- os
- YOLO from ultralytics
- requests
- datetime
- deque from collections

Change upload, to_video and video_path parameters to whatever you need (at bottom of file).

Run process_video.py

### To run the backend tests
Uncomment line 18 and line 51 in the index.js file located in the backend folder.

Comment out line 19 and line 52 in the index.js file located in the backend folder.

cd Backend npm test 