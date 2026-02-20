import { useState, useEffect, useRef, useCallback } from 'react';

export type UserRole = 'STUDENT' | 'TPO' | 'RECRUITER';

export interface UserData {
  email: string;
  role: UserRole;
}

export function useWebSocketAuth() {
  const [approvedUsers, setApprovedUsers] = useState<UserData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Establish connection
    const ws = new WebSocket('ws://localhost:8000/ws/auth');
    socketRef.current = ws;

    ws.onopen = () => console.log('🟢 WebSocket Connected!');
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'STATE_UPDATE') {
          console.log('📡 Received Live State:', data);
          setApprovedUsers(data.approvedUsers);
          setPendingUsers(data.pendingUsers);
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    ws.onerror = (error) => console.error('🔴 WebSocket Error:', error);
    
    ws.onclose = () => {
      console.log('⚪ WebSocket Closed');
      // FIX: Only clear the ref if THIS specific socket is the current one!
      // This stops React Strict Mode from deleting the newly created WebSocket.
      if (socketRef.current === ws) {
        socketRef.current = null;
      }
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  // 2. A robust sender that waits for the connection to be ready
  const safeSend = useCallback((payload: any) => {
    const ws = socketRef.current;
    if (!ws) {
      console.warn('WebSocket is null, cannot send.');
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    } else if (ws.readyState === WebSocket.CONNECTING) {
      console.log('⏳ Socket connecting... queuing message for 500ms');
      setTimeout(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify(payload));
        } else {
          console.error('❌ Socket still not open after wait. Message dropped.');
        }
      }, 500);
    } else {
      console.error('❌ Socket is closed. Cannot send message.');
    }
  }, []);

  // 3. Expose action functions
  const requestAccess = useCallback((email: string, role: UserRole) => {
    console.log("📤 Sending REQUEST_ACCESS for:", email);
    safeSend({ type: 'REQUEST_ACCESS', email, role });
  }, [safeSend]);

  const directRegister = useCallback((email: string, role: UserRole) => {
    safeSend({ type: 'DIRECT_REGISTER', email, role });
  }, [safeSend]);

  const approveUser = useCallback((email: string) => {
    safeSend({ type: 'APPROVE_USER', email });
  }, [safeSend]);

  const rejectUser = useCallback((email: string) => {
    safeSend({ type: 'REJECT_USER', email });
  }, [safeSend]);

  return {
    approvedUsers,
    pendingUsers,
    requestAccess,
    directRegister,
    approveUser,
    rejectUser,
  };
}