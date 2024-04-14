# ECS7019U-Advanced_Group_Project
## Dependencies
- [Tesseract OCR ver 5.3.3.20231005](https://github.com/UB-Mannheim/tesseract/wiki)
- [Node.js](https://nodejs.org/en/download)
- [MongoDBCompass](https://www.mongodb.com/try/download/compass)

# How to use:
### To connect to the backend server
```bash
cd Backend 
npm install
npm run
```
### To start to the frontend site (requires backend)
```bash
cd Frontend 
npm install
frontend npm start
```

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
