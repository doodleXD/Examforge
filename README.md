# ExamForge 🎓

> **A full-stack, AI-powered secure online examination platform with real-time proctoring, anti-cheating enforcement, and semantic answer evaluation.**

Built as a solo final project. No external proctoring services — everything runs in the browser.

---

## ✨ Features at a Glance

| Category | Features |
|---|---|
| **Authentication** | Email + OTP login, Google OAuth, role auto-detection by email domain |
| **Admin** | Create exams, manage questions with model answers, generate 24hr exam codes, shareable links, results dashboard, CSV export, score override |
| **Student** | Join via code or shareable link, pre-exam checklist, timed exam interface, digital whiteboard, auto-save |
| **Proctoring** | Fullscreen enforcement, tab-switch detection, copy-paste prevention, back-navigation trap, screenshot blur, DevTools detection |
| **Face Detection** | Real-time webcam face presence monitoring, multiple-face detection, audio detection |
| **AI Scoring** | HuggingFace semantic similarity scoring with TF-IDF fallback |

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| TailwindCSS | Styling |
| React Router v6 | Client-side routing |
| Zustand + persist | Auth state management |
| Axios | API calls |
| face-api.js | Client-side face detection |
| react-hot-toast | Notifications |

### Backend
| Tool | Purpose |
|---|---|
| Node.js 20 + Express | REST API server |
| Prisma ORM | Database queries |
| PostgreSQL (Neon) | Primary database |
| bcrypt | Password hashing |
| jsonwebtoken | JWT auth |
| Nodemailer + Gmail | OTP email delivery |
| Passport.js | Google OAuth 2.0 |
| express-rate-limit | Brute force protection |
| natural | TF-IDF fallback scoring |
| axios | HuggingFace API calls |

---

## 📁 Project Structure

```
examforge/
├── frontend/                  # React + Vite app
│   ├── public/
│   │   └── models/            # face-api.js model files
│   └── src/
│       ├── api/               # Axios API call functions
│       ├── components/        # Reusable UI components
│       ├── hooks/             # Custom React hooks
│       ├── pages/
│       │   ├── Admin/         # Admin dashboard pages
│       │   ├── Auth/          # Login, OTP, Google callback
│       │   └── Student/       # Student exam pages
│       └── store/             # Zustand auth store
│
└── backend/                   # Node.js + Express API
    ├── prisma/
    │   └── schema.prisma      # Database schema
    └── src/
        ├── config/            # Passport Google OAuth config
        ├── controllers/       # Business logic
        ├── middleware/        # Auth guard, rate limiter
        ├── routes/            # Express route definitions
        ├── services/          # Email, OTP, AI evaluation
        └── utils/             # JWT, code generator, Prisma client
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm
- A free [Neon](https://neon.tech) PostgreSQL database
- A Gmail account with App Password enabled
- A free [HuggingFace](https://huggingface.co) account
- A [Google Cloud](https://console.cloud.google.com) project with OAuth credentials

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/examforge.git
cd examforge
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
# Server
PORT=5000

# Database — get from neon.tech
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/examforge?sslmode=require"

# JWT
JWT_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
JWT_EXPIRES_IN=8h

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Gmail SMTP — use App Password, not your real password
# Enable 2FA on Gmail → Security → App Passwords → Generate
GMAIL_USER=youremail@gmail.com
GMAIL_PASS=your-16-char-app-password

# Google OAuth — from console.cloud.google.com
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# HuggingFace — from huggingface.co → Settings → Access Tokens
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxx
```

Run database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend:

```bash
npm run dev
# Server running on port 5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Download face-api.js model files into `frontend/public/models/`:

Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Download these 2 files:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`

Start the frontend:

```bash
npm run dev
# Local: http://localhost:5173
```

---

### 4. Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → OAuth consent screen → External
3. Credentials → Create OAuth 2.0 Client ID → Web application
4. Authorized JavaScript origins:
   ```
   http://localhost:5000
   http://localhost:5173
   ```
5. Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. Copy Client ID and Client Secret to `backend/.env`

---

### 5. Gmail App Password Setup

1. Go to your Google Account → Security
2. Enable 2-Step Verification
3. Security → App Passwords → Select "Mail" → Custom name "ExamForge"
4. Copy the 16-character password to `GMAIL_PASS` in `backend/.env`

---

## 🎯 How to Use

### As an Admin (Teacher)

1. **Register** with an `@iitr.ac.in` email — you'll be assigned the Admin role automatically
2. **Create an exam** — add title, subject, duration, total marks
3. **Add questions** — each question has question text, model answer (for AI scoring), and marks
4. **Finalize** — generates a unique `EF-XXXXXX` exam code valid for 24 hours
5. **Share** the code or shareable link with students
6. **View Results** after students submit — AI scores appear automatically
7. **Override scores** manually if needed
8. **Export CSV** for grading records

### As a Student

1. **Register** with any non-`@iitr.ac.in` email
2. **Enter exam code** on the student dashboard — or click the shareable link from your teacher
3. **Complete the pre-exam checklist**:
   - Grant camera + microphone access
   - Confirm single monitor
   - Enable fullscreen
   - Accept exam rules
4. **Take the exam** — answers auto-save every 10 seconds
5. **Use the whiteboard** for rough work (not submitted)
6. **Submit** when done — camera turns off, scores calculated by AI

---

## 🔒 Anti-Cheating Mechanisms

| Mechanism | How It Works |
|---|---|
| Fullscreen enforcement | Exam opens in fullscreen; exiting triggers a violation |
| Tab switch detection | Page Visibility API detects any tab/window switch |
| Copy-paste prevention | Ctrl+C, Ctrl+V, right-click disabled on question text |
| Back navigation trap | Browser back button logs a violation instead of navigating |
| Screenshot blur | PrintScreen key blurs the screen for 3 seconds |
| DevTools detection | Window size monitoring detects DevTools opening |
| Face absence | face-api.js checks every 5s; 20 cumulative seconds absent = 1 violation |
| Multiple faces | Two or more faces in camera = instant violation |
| Audio detection | Sustained speaking for 15s = violation |
| Auto-submit | After 3 violations, exam submits automatically and is flagged |
| Backend timer | Timer stored server-side — refreshing the page does not reset the timer |

---

## 🤖 AI Answer Evaluation

ExamForge uses **semantic similarity** to score descriptive answers:

1. After submission, each student answer is compared to the admin's model answer
2. **Primary method**: HuggingFace `sentence-transformers/all-MiniLM-L6-v2` API (free tier)
3. **Fallback**: TF-IDF cosine similarity (runs locally, no API needed)

**Scoring thresholds:**
| Similarity | Score |
|---|---|
| > 0.75 | Full marks |
| 0.50 – 0.75 | `similarity × marks` |
| < 0.50 | `similarity × marks × 0.5` |

Evaluation runs in the background — students see their submitted screen immediately, scores appear in the admin dashboard within 10–30 seconds.

---

## 🌐 Deployment

### Frontend → Vercel

```bash
# Push frontend/ to GitHub
# Go to vercel.com → New Project → Import repo
# Set environment variable:
VITE_API_URL=https://your-render-backend.onrender.com
```

### Backend → Render

```bash
# Push backend/ to GitHub
# Go to render.com → New Web Service → Connect repo
# Build command:
npm install && npx prisma migrate deploy && npx prisma generate
# Start command:
node server.js
# Add all .env variables in Render dashboard
```

### Database → Neon (already configured)

Update `DATABASE_URL` in Render with your Neon production connection string.

### Update Google OAuth for production

Add to Authorized JavaScript origins:
```
https://your-app.vercel.app
https://your-api.onrender.com
```

Add to Authorized redirect URIs:
```
https://your-api.onrender.com/api/auth/google/callback
```

Update `GOOGLE_CALLBACK_URL` and `FRONTEND_URL` in Render environment variables.

---

## 📊 Database Schema

| Table | Purpose |
|---|---|
| `User` | Stores all users (admin + student) with role and auth provider |
| `Exam` | Exam metadata — title, subject, duration, status |
| `ExamCode` | Generated codes with 24hr expiry |
| `Question` | Questions with model answers and marks |
| `Submission` | Student exam sessions with violation count and status |
| `Answer` | Student answers with AI scores and admin override scores |
| `Violation` | Timestamped log of each violation event |
| `Otp` | Hashed OTPs with expiry timestamps |

---

## 🔑 Role Detection

| Email Domain | Role | Dashboard |
|---|---|---|
| `@iitr.ac.in` | Admin | Exam management dashboard |
| Any other domain | Student | Exam portal |

To change the admin domain, update this line in `backend/src/controllers/authController.js`:
```javascript
const role = email.endsWith('@iitr.ac.in') ? 'admin' : 'student';
```

---

## ⚠️ Known Limitations

- Screenshot prevention is CSS-based — works as a deterrent, not a full block
- Multiple monitor detection requires Chrome 100+ or Edge 100+ (`screen.isExtended`)
- Face detection accuracy depends on lighting and camera quality
- HuggingFace free tier has ~1000 requests/day limit — TF-IDF fallback activates automatically
- Render free tier cold-starts after 15 minutes of inactivity — use [cron-job.org](https://cron-job.org) to keep it warm

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Author

Built solo as a final project.

> ExamForge — because trust should be built in, not bolted on.
