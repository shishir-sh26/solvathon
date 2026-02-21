from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# --- IMPORT ALL ROUTERS ---
from app.api import recruiter, student, resume, auth, auth_ws, tpo, analytics, bot, interview

app = FastAPI(title="PlacementPro API")

# --- 1. GLOBAL EXCEPTION HANDLER ---
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

# --- 2. CORS SETUP ---
print("DEBUG: Initializing CORS with unrestricted origins (*)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. WEBSOCKET STATE & MANAGER ---
approved_users = [{"email": "admin@college.edu", "role": "TPO"}]
pending_users = []

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        await self.broadcast_state()

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_state(self):
        state_message = {
            "type": "STATE_UPDATE",
            "approvedUsers": approved_users,
            "pendingUsers": pending_users
        }
        for connection in self.active_connections:
            try:
                await connection.send_json(state_message)
            except RuntimeError:
                pass

manager = ConnectionManager()

@app.websocket("/ws/auth")
async def websocket_auth_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print(f"🟢 WEBSOCKET RECEIVED: {data}")
            
            msg_type = data.get("type")
            email = data.get("email")
            role = data.get("role")

            if msg_type == "REQUEST_ACCESS":
                if not any(u['email'] == email for u in pending_users) and not any(u['email'] == email for u in approved_users):
                    pending_users.append({"email": email, "role": role})
                await manager.broadcast_state()
                
            elif msg_type == "DIRECT_REGISTER":
                if not any(u['email'] == email for u in approved_users):
                    approved_users.append({"email": email, "role": role})
                await manager.broadcast_state()

            elif msg_type == "APPROVE_USER":
                user = next((u for u in pending_users if u['email'] == email), None)
                if user:
                    pending_users.remove(user)
                    approved_users.append(user)
                await manager.broadcast_state()

            elif msg_type == "REJECT_USER":
                user = next((u for u in pending_users if u['email'] == email), None)
                if user:
                    pending_users.remove(user)
                await manager.broadcast_state()

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("🔴 Client disconnected cleanly")
    except Exception as e:
        manager.disconnect(websocket)
        print(f"❌ WEBSOCKET CRASHED: {e}")

# --- 4. REGISTER ALL API ROUTERS ---
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["Recruiter"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
# Add other routers from your import list as needed
# app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

# --- 5. ROOT ENDPOINT ---
@app.get("/")
async def root():
    return {"message": "PlacementPro Backend is Live. WebSockets active."}