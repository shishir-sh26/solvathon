# Project Architecture: Placement Pro

## 📂 Overall Folder Structure

```text
placement-pro/
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── assets/         # Static assets (images, logos)
│   │   ├── lib/            # External library configurations (Axios, Supabase)
│   │   ├── store/          # Global state management (Zustand)
│   │   ├── pages/          # Top-level Page Assemblies (Route targets)
│   │   ├── features/       # Modular Feature Components (Domain-driven)
│   │   │   ├── student/    # Student applications & dashboard
│   │   │   ├── tpo/        # Placement officer controls
│   │   │   ├── recruiter/  # Recruiter job management & analytics
│   │   │   ├── interview/  # Virtual mock interview system
│   │   │   └── shared/     # Cross-feature components (e.g., Placement Bot)
│   │   ├── shared/         # Reusable UI components & utilities
│   │   ├── App.tsx         # Main router and layout orchestrator
│   │   └── main.tsx        # Application entry point
│   ├── tailwind.config.js  # Styling configuration
│   └── package.json
│
├── backend/                # FastAPI + Python
│   ├── app/
│   │   ├── api/            # Route endpoints (auth, student, tpo, bot)
│   │   ├── core/           # Config, Database setup, and SQL schemas
│   │   ├── services/       # AI & Business Logic (Gemini, Langchain, OCR)
│   │   ├── models/         # Pydantic schemas for validation
│   │   └── main.py         # App entry point & middleware logic
│   ├── .env                # API keys and secrets (Private)
│   └── requirements.txt    # Python dependencies
│
└── README.md               # Quick-start guide
```

## 🏗️ Technical Design Patterns

### 1. Feature-First Monolith (Frontend)
The frontend uses a "Feature-based" structure. Instead of organizing by technical type (all components here, all hooks there), we group everything related to a business domain (like `recruiter`) into one folder.
- **Pages vs Features:** `pages/` handle the routing and high-level layout, while `features/` contain the complex logic.

### 2. Service-Oriented Backend
The backend isolates complex AI operations (like Langchain Agents or Resume Parsing) into a `services/` layer.
- **API Layer:** Handles HTTP requests and response formatting.
- **Service Layer:** Handles "Heavy Lifting" like calling Gemini or parsing PDFs.
- **Model Layer:** Ensures data integrity using Pydantic.

### 3. Shared AI Orchestration
The **Placement Bot (Jarvis)** is a cross-cutting concern. It lives in `features/shared` but has access to the global `useBotStore` and backend `/bot` endpoints, allowing it to provide assistance regardless of which page the user is on.
