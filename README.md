# ECS7019U-Advanced_Group_Project
## Dependencies
- [Tesseract OCR ver 5.3.3.20231005](https://github.com/UB-Mannheim/tesseract/wiki)
- [Node.js](https://nodejs.org/en/download)
- [MongoDBCompass](https://www.mongodb.com/try/download/compass)

# How to use:
### To connect to the backend server
```bash
cd Backend npm install
npm run
```
### To start to the frontend site (requires backend)
```bash
cd Frontend/councilsite/frontend npm install
frontend npm run
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

### To run the backend tests
Uncomment line 18 and line 51 in the index.js file located in the backend folder.

Comment out line 19 and line 52 in the index.js file located in the backend folder.

cd Backend npm test 


Change upload, to_video and video_path parameters to whatever you need.

Run process_video.py
