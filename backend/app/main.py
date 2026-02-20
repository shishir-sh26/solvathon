from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# --- IMPORT ALL ROUTERS HERE ---
from app.api import recruiter 
from app.api import student  # <-- NEW: Import student router
from app.api import resume   # <-- NEW: Import resume router

app = FastAPI(title="PlacementPro API")

# --- 1. CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. WEBSOCKET STATE & MANAGER (Fixes the TPO Alerts!) ---

# In-memory database for the hackathon
approved_users = [{"email": "admin@college.edu", "role": "TPO"}]
pending_users = []

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Instantly send the current state to the new connection
        await self.broadcast_state()

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_state(self):
        """Sends the live user lists to ALL connected dashboards (TPO & Auth screens)"""
        state_message = {
            "type": "STATE_UPDATE",
            "approvedUsers": approved_users,
            "pendingUsers": pending_users
        }
        for connection in self.active_connections:
            try:
                await connection.send_json(state_message)
            except RuntimeError:
                # Connection dropped mid-send
                pass

manager = ConnectionManager()

@app.websocket("/ws/auth")
async def websocket_auth_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # 1. Catch the data
            data = await websocket.receive_json()
            
            # 2. PRINT IT so we can see it in the terminal!
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


# --- 3. REGISTER ALL API ROUTERS ---
# (This fixes the 404 errors for the Student Portal!)
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["Recruiter"])
app.include_router(student.router, prefix="/api/student", tags=["Student"]) # <-- NEW
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])    # <-- NEW


# --- 4. ROOT ENDPOINT ---
@app.get("/")
async def root():
    return {"message": "PlacementPro Backend is Live. WebSockets active."}