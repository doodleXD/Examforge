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
- A live relational database (PostgreSQL, MySQL, or Supabase/Neon instance)

---

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/yourusername/examforge.git](https://github.com/yourusername/examforge.git)
   cd examforge/backend
