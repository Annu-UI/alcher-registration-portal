# 🎪 Alcheringa Registration Portal

<div align="center">

![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)

**A full-stack, highly concurrent event registration platform engineered for North East India's Largest Cultural Fest.**

[Live Staging →](https://regportal-frontend-new.onrender.com/)

</div>

---

## 📖 Overview

The Alcheringa Registration Portal handles dynamic attendee management, multi-step registration workflows, team formation, and an offline volunteer portal — built to scale under the demand of India's largest college cultural festival hosted at IIT Guwahati.

---

## 🏗️ Architecture

```
alcher-registration-portal/
├── backend/          # Django REST Framework API
│   ├── backend/      # Core settings, routing
│   ├── users/        # Auth, OTP, user models
│   ├── competitions/ # Events, teams, registrations
│   └── offlinePortal/# Volunteer desk management
└── frontend/         # React SPA
    └── src/
        ├── components/
        │   ├── AuthPage/     # Multi-step registration flow
        │   └── landingPage/  # Public-facing UI
        └── pages/
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Tailwind CSS, Framer Motion, GSAP, React Router v7 |
| **Backend** | Django 5.2, Django REST Framework, SimpleJWT |
| **Database** | PostgreSQL (via `psycopg2` + `dj-database-url`) |
| **Auth** | JWT + OTP email verification + Google OAuth (`django-allauth`) |
| **Deployment** | Docker, Gunicorn (4 workers), WhiteNoise |
| **Email** | Django email backend (HTML + plain-text templates) |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL instance (local or cloud)

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Fill in: SECRET_KEY, DATABASE_URL, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, GOOGLE_CLIENT_ID

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

npm install
npm start
# Runs on http://localhost:3000
```

### Docker (Backend)

```bash
cd backend
docker build -t alcher-backend .
docker run -p 80:80 --env-file .env alcher-backend
```

---

## 🔑 Environment Variables

Create a `.env` file in `/backend`:

```env
# Django
SECRET_KEY=your-secret-key
PROD=true                          # Omit for local dev

# Database
DATABASE_URL=postgres://user:pass@host:5432/dbname

# Email
EMAIL_HOST_USER=your@email.com
EMAIL_HOST_PASSWORD=your-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register/` | Register new user (step 1) |
| `POST` | `/api/verify-otp/` | OTP email verification |
| `POST` | `/api/token/` | Obtain JWT access + refresh tokens |
| `POST` | `/api/token/refresh/` | Refresh access token |
| `POST` | `/accounts/google/login/` | Google OAuth login |

### Competitions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/competitions/` | List all competitions by module |
| `GET` | `/api/competitions/<id>/` | Competition detail |
| `POST` | `/api/register-team/` | Register team for an event |
| `GET` | `/api/my-registrations/` | Authenticated user's registrations |

### Offline Portal (Volunteer Desk)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/offlineportal/search/` | Search participants |
| `GET` | `/offlineportal/eventwise_search/` | Filter by event |
| `POST` | `/offlineportal/event` | Offline event registration |
| `GET/POST` | `/offlineportal/Allotment/` | Room allotment |
| `GET` | `/offlineportal/generate-invoice/` | Generate participant invoice |
| `GET` | `/offlineportal/all_users/` | Full participant list |

---

## 🧩 Key Features

- **Multi-step Registration** — Profile → OTP verification → Team formation with a stateful `RegistrationSession` model
- **Team Management** — Solo or group events with configurable min/max members, leader assignment, and M2M member relations
- **Google OAuth** — One-click login via `@react-oauth/google` + `django-allauth`
- **Confirmation Emails** — Responsive HTML emails with team details sent on successful registration
- **Offline Volunteer Portal** — Desk-side UI for on-ground volunteers: room allotment, blanket/dues tracking, invoice generation, CSV imports
- **JWT Auth** — Stateless, secure access/refresh token flow throughout the API

---

## 🗃️ Data Models

```
NewUser (AbstractBaseUser)
  └── RegistrationSession (OTP, stage tracking)

Module
  └── Competition (event details, solo/group, prize, rules)
        └── CompTeam (leader → NewUser, members → TeamMembers)
              └── SubmitPerformance (link + description)
```

---

## 🌐 Deployment

The backend is Dockerized and deployed on [Render](https://render.com). The `runserver.sh` entrypoint:

1. Runs `collectstatic`
2. Applies migrations
3. Starts Gunicorn with 4 workers on port 80

> **Note on Staging:** The free-tier Render instance may take up to 60 seconds to wake from idle on first request.

**CORS origins configured for production:**
- `https://reg.alcheringa.co.in`
- `https://registrations.alcheringa.co.in`

**Backend API base:** `https://reg26-api.alcheringa.co.in`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is the property of the **Alcheringa Technical Team, IIT Guwahati**. All rights reserved.

---

<div align="center">
  Built with ❤️ by the Alcheringa Tech Team · <a href="https://alcheringa.co.in">alcheringa.co.in</a>
</div>
