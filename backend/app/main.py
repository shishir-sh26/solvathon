from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# IMPORT auth_ws HERE
from app.api import auth, auth_ws, tpo, student, resume, analytics, bot, interview

app = FastAPI(title="Placement Pro API")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"GLOBAL ERROR: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

print("DEBUG: Initializing CORS with unrestricted origins (*)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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