Women Empowerment Dashboard (React + Flask)
==========================================

This project is a frontend + backend demo re-themed for Women Empowerment.
It includes:
  - Login (JWT)
  - Responsive dashboard with theme toggle (light/dark)
  - Photo gallery (empowerment-themed images from Unsplash)
  - Annotation/reporting UI (draw box, add label, submit to API)
  - Reports (history) page to view submitted reports

RUNNING LOCALLY
---------------
1) Backend
   cd backend
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # mac/linux:
   # source .venv/bin/activate
   pip install -r requirements.txt
   python run.py
   (server runs on http://localhost:5000)

2) Frontend
   cd frontend
   npm install
   npm start
   (dev server on http://localhost:3000, proxies /api/v1 to backend)

AUTH
----
Test accounts:
  - alice / password123
  - bob / hunter2

NOTES
-----
- This demo uses Unsplash image URLs for gallery thumbnails. For offline or production use, download chosen images and place them in frontend/public/images then update the backend gallery URLs.
- The backend stores annotations in memory (ANNOTATIONS list). For production persistance, swap to a database.
