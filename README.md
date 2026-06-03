# ExamForge

ExamForge is a secure, AI-powered examination platform featuring automated question extraction, strict environmental proctoring, and role-based access control. Designed for seamless deployment and robust institutional use.

🔗 **Live Frontend Application:** [https://examforge-peach.vercel.app/](https://examforge-peach.vercel.app/)

## 🚀 Core Features

### 1. Hybrid Authentication & Role Routing
- **OTP & OAuth:** Supports traditional Email/Password login, Google OAuth, or a linked combination. Time-sensitive (10-minute expiry) OTP tokens are delivered reliably via the Brevo HTTP API.
- **Smart Role Assignment:** Automatically checks the email domain during registration:
  - 🔑 `@iitr.ac.in` $\rightarrow$ Assigned **`admin`** role (Redirects to Instructor Dashboard).
  - 🎓 All other domains $\rightarrow$ Assigned **`student`** role (Redirects to Student Exam Portal).

### 2. AI-Powered Exam Generation
- **Image-to-Text Processing:** Instructors can upload images or screenshots of question papers. The integrated AI vision system extracts the text, formats the questions, identifies options, and configures the automated grading rubric instantly.

### 3. Strict Proctoring Engine
- **Pre-Exam Checks:** Enforces hardware permissions (Camera, Microphone, Screen-share) and Fullscreen mode before the test initiates.
- **The "Three Strikes" Policy:** Actively monitors window focus, tab switching, and fullscreen exits. 
  - Violations 1 & 2 trigger severe on-screen warnings.
  - Violation 3 triggers an immediate, forced auto-submission of the exam and locks the student out of the session.

### 4. Advanced Analytics & Export
- **Automated Grading:** The AI-configured rubric instantly grades the submission upon completion or forced termination.
- **Violation Logging:** Admins can view individual student profiles to see flagged behavior and violation counts.
- **CSV Export:** One-click generation of structured CSV files containing student data, final scores, and proctoring logs for institutional record-keeping.

---

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js (Backend) / Next.js & React (Frontend)
- **Database ORM:** Prisma
- **Database:** PostgreSQL / MySQL (Production optimized)
- **Security & Hashing:** Bcrypt & JsonWebToken (JWT)
- **Transactional Emails:** Brevo HTTP API (Native Fetch)

---

## 📋 Prerequisites

Before running this project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) 
- A live relational database (PostgreSQL, MySQL, or Supabase instance)

---

## ⚙️ Environment Variables

Create a `.env` file in your root `/backend` folder and populate it with the following configurations. Ensure these matches are mirrored perfectly in your Render Dashboard:

```env
# Server Configuration
PORT=5000

# Database Connection (Prisma)
DATABASE_URL="your_relational_database_connection_string"

# JWT Token Security
JWT_SECRET="your-64-char-random-hex-key"

# Live Production Frontend Domain (No trailing slash)
FRONTEND_URL="[https://examforge-peach.vercel.app](https://examforge-peach.vercel.app)"

# Brevo Email API Configuration
BREVO_API_KEY="your_brevo_api_key_here"
SENDER_EMAIL="your_verified_brevo_gmail_address@gmail.com"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
