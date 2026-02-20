from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# IMPORT auth_ws HERE
from app.api import auth, auth_ws, tpo, student, resume, analytics, bot, interview

app = FastAPI(title="Placement Pro API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # <-- explicitly allow your Vite frontend
    allow_credentials=True,                   # <-- changed to True
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Placement Pro API"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# ADD THE WEBSOCKET ROUTER HERE
app.include_router(auth_ws.router, tags=["WebSockets"]) 

app.include_router(tpo.router, prefix="/api/tpo", tags=["TPO"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(bot.router, prefix="/api/bot", tags=["Jarvis Bot"])
app.include_router(interview.router, prefix="/api/interview", tags=["Virtual Interview"])