# Alcheringa Registration Portal

A full-stack, highly concurrent event registration platform engineered to handle dynamic attendee management, multi-step workflows, and real-time operations for North East India's Largest Cultural Fest.

## Architecture & Tech Stack
- **Frontend:** React, Tailwind CSS, Next.js client state management (Virtual lists, localized storage).
- **Backend:** Django REST Framework (DRF), PostgreSQL relational indexing, stateless JWT Authentication architecture.
- **Infrastructure:** Split-codebase monorepo tracking isolated frontend and backend environments.

## Live Staging Environment
- **Staging Instance:** [Click here to view Live Staging on Render](https://regportal-frontend-new.onrender.com/ )
- *Note for Reviewers: This deployment is hosted on a free-tier Render instance. If the database is currently asleep or idling due to automated cluster management, cold starts may take up to 60 seconds to resolve initial database handshakes.*
