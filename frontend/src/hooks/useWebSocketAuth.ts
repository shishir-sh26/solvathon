import { useState, useEffect, useCallback, useRef } from 'react';

export type UserRole = 'TPO' | 'STUDENT' | 'RECRUITER';

interface UserData {
  email: string;
  role: UserRole;
}

export function useWebSocketAuth() {
  const [approvedUsers, setApprovedUsers] = useState<UserData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Establish connection
    const socket = new WebSocket('ws://localhost:8000/ws/auth');
    ws.current = socket;

    socket.onopen = () => console.log("🟢 WebSocket Connected!");
    socket.onerror = (e) => console.error("🔴 WebSocket Error:", e);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STATE_UPDATE') {
        setPendingUsers(data.pendingUsers);
        setApprovedUsers(data.approvedUsers);
      }
    };

    return () => {
      // 2. Prevent the "Closed before established" warning in React StrictMode
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  // 3. The "Safe Send" Wrapper - Hackathon lifesaver!
  const safeSend = (payload: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket still connecting... retrying in 500ms");
      // If the user clicks a button too fast, wait half a second and retry
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(payload));
        } else {
          alert("Connecting to server... Please try clicking again.");
        }
      }, 500);
    }
  };

  // Action Functions
  const requestAccess = useCallback((email: string, role: UserRole) => {
    safeSend({ action: 'REQUEST_ACCESS', email, role });
  }, []);

  const directRegister = useCallback((email: string, role: UserRole) => {
    safeSend({ action: 'DIRECT_REGISTER', email, role });
  }, []);

  const approveUser = useCallback((email: string) => {
    safeSend({ action: 'APPROVE_USER', email });
  }, []);

  const rejectUser = useCallback((email: string) => {
    safeSend({ action: 'REJECT_USER', email });
  }, []);

  return {
    approvedUsers,
    pendingUsers,
    requestAccess,
    directRegister,
    approveUser,
    rejectUser
  };
}