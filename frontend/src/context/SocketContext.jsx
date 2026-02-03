import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket server
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        // Join user's personal room
        newSocket.emit('user:online', user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect socket if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  // Socket event helpers
  const joinChatRoom = (chatRoomId) => {
    if (socket) {
      socket.emit('chat:join', chatRoomId);
    }
  };

  const leaveChatRoom = (chatRoomId) => {
    if (socket) {
      socket.emit('chat:leave', chatRoomId);
    }
  };

  const sendMessage = (chatRoomId, message) => {
    if (socket) {
      socket.emit('chat:message', { chatRoomId, message });
    }
  };

  const sendTyping = (chatRoomId, user) => {
    if (socket) {
      socket.emit('chat:typing', { chatRoomId, user });
    }
  };

  const sendStopTyping = (chatRoomId, user) => {
    if (socket) {
      socket.emit('chat:stopTyping', { chatRoomId, user });
    }
  };

  const markMessagesRead = (chatRoomId, userId) => {
    if (socket) {
      socket.emit('chat:read', { chatRoomId, userId });
    }
  };

  const value = {
    socket,
    isConnected,
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    sendTyping,
    sendStopTyping,
    markMessagesRead,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
