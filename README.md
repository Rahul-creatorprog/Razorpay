# 🚀 RecoverAI — Razorpay Revenue Recovery Copilot

**RecoverAI** is an AI-powered revenue recovery copilot for Razorpay merchants, built on top of **Google Gemini 1.5** and **Express / React Vite**.

---

## 🎯 Key Features

- ⚡ **Razorpay Webhook Integration**: Listens for real-time `payment.failed` and `payment.captured` gateway events.
- 🧠 **Google Gemini AI Engine**: Dynamic scoring of recovery probability (0-100%), customer intent tiering, and personalized multilingual outreach copywriting.
- 💬 **Multi-Channel Recovery**: Automated WhatsApp, Email, and SMS campaign execution with embedded Razorpay checkout links (`https://rzp.io/l/recoverai-retry`).
- 📊 **Revenue Analytics**: Real-time tracking of failed revenue, recovered revenue, and channel recovery rates.

---

## 🏗️ Architecture

```
revenue-recovery/
├── server/               # Express 5 Backend API Server
│   ├── index.js          # Razorpay Webhooks & Gemini AI Endpoints
│   ├── models/           # Mongoose Database Schemas (FailedPayment, AiPrediction)
│   └── package.json
└── client/               # React 19 + Vite Frontend Application
    ├── src/
    │   ├── pages/        # Dashboard, Payments, AI Insights, Recovery, Analytics
    │   ├── components/   # Interactive Razorpay Payment Modal
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd server
npm install
node index.js
# Backend runs on http://localhost:5000
```

### 2. Start Frontend App
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5174
```

---

## 👨‍💻 Author & Attribution
- **Developer**: Rahul
- **Institution**: KPR College of Arts, Science and Research
- **Repository**: [Rahul-creatorprog/Razorpay](https://github.com/Rahul-creatorprog/Razorpay)
