# ExamForge Backend

ExamForge is a secure, robust authentication system featuring Email/Password registration, One-Time Password (OTP) multi-factor verification, and Google OAuth integration. Designed for seamless deployment on cloud networks like Render without port or domain restrictions.

🔗 **Live Frontend Application:** [https://examforge-peach.vercel.app/](https://examforge-peach.vercel.app/)

## 🚀 Features

- **Hybrid Authentication:** Supports traditional Email/Password login, Google OAuth, or a linked combination of both.
- **Secure OTP Verification:** Generates time-sensitive (10-minute expiry) OTP tokens for secure logins via the Brevo HTTP API.
- **Institutional Role-Based Routing:** Automatically checks the domain of the email address during registration to assign permissions and control frontend dashboard redirection:
  - 🔑 Emails ending with `@iitr.ac.in` $\rightarrow$ Assigned **`admin`** role (Redirects to Admin Panel).
  - 🎓 All other email domains $\rightarrow$ Assigned **`student`** role (Redirects to Student Exam Dashboard).

---

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js
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

Create a `.env` file in your root `/backend` folder and populate it with the following configurations. Ensure these matches are also mirrored perfectly in your Render Dashboard:

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

# Google OAuth Credentials (If using Google Login)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
