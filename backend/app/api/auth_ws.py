# backend/app/api/auth_ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Keep track of all active browser connections
        self.active_connections: List[WebSocket] = []
        
        # In-memory queues for the real-time MVP demo
        self.pending_users = []
        self.approved_users = [{"email": "admin@college.edu", "role": "TPO"}]

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Instantly send the current list to the new user who just connected
        await self.send_state(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self):
        """Broadcasts the updated pending/approved lists to ALL connected devices instantly."""
        message = {
            "type": "STATE_UPDATE",
            "pendingUsers": self.pending_users,
            "approvedUsers": self.approved_users
        }
        for connection in self.active_connections:
            await connection.send_json(message)

    async def send_state(self, websocket: WebSocket):
        """Sends state to a single user."""
        await websocket.send_json({
            "type": "STATE_UPDATE",
            "pendingUsers": self.pending_users,
            "approvedUsers": self.approved_users
        })

manager = ConnectionManager()

@router.websocket("/ws/auth")
async def websocket_auth_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Listen for messages from the React frontend
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("action")

            if action == "REQUEST_ACCESS":
                new_user = {"email": payload["email"], "role": payload["role"]}
                # Add to pending if they don't already exist
                if not any(u["email"] == new_user["email"] for u in manager.pending_users + manager.approved_users):
                    manager.pending_users.append(new_user)
                await manager.broadcast()

            elif action == "DIRECT_REGISTER":
                manager.approved_users.append({"email": payload["email"], "role": payload["role"]})
                await manager.broadcast()

            elif action == "APPROVE_USER":
                email = payload["email"]
                user = next((u for u in manager.pending_users if u["email"] == email), None)
                if user:
                    manager.pending_users = [u for u in manager.pending_users if u["email"] != email]
                    manager.approved_users.append(user)
                    await manager.broadcast()

            elif action == "REJECT_USER":
                email = payload["email"]
                manager.pending_users = [u for u in manager.pending_users if u["email"] != email]
                await manager.broadcast()

    except WebSocketDisconnect:
        manager.disconnect(websocket)