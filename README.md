# ECS7019U-Advanced_Group_Project
## Dependencies
- [Tesseract OCR ver 5.3.3.20231005](https://github.com/UB-Mannheim/tesseract/wiki)
- [Node.js](https://nodejs.org/en/download)
- [MongoDBCompass](https://www.mongodb.com/try/download/compass)
- [Python 3.10](https://www.python.org/downloads/release/python-3100/)
- [pip](https://pypi.org/project/pip/)

# How to use:
## To connect to the backend server
```bash
cd Backend 
npm install
npm run
```
## To start to the frontend site (requires backend)
```bash
cd Frontend 
npm install
npm start
```

## To run the pipeline (upload requires backend)
### Install python packages:
#### From root directory:
```bash
cd "Dashcam Processing"
```

```bash
pip install numpy
pip install torch
pip install pytesseract
pip install opencv-python
pip install ultralytics
pip install requests
```

Change upload, to_video and video_path parameters to whatever you need (at bottom of file).

Run:
```bash
python process_video.py
```

