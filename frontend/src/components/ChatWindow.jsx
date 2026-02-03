import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatService } from '../services/chatService';
import Avatar from './Avatar';
import { formatTime, formatRelativeTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const ChatWindow = ({ taskId, chatRoomId }) => {
  const { user } = useAuth();
  const { socket, joinChatRoom, leaveChatRoom, sendMessage: socketSendMessage } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatRoom, setChatRoom] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadChat();

    return () => {
      if (chatRoomId) {
        leaveChatRoom(chatRoomId);
      }
    };
  }, [taskId, chatRoomId]);

  useEffect(() => {
    if (chatRoomId && socket) {
      joinChatRoom(chatRoomId);

      // Listen for new messages
      socket.on('chat:newMessage', (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      // Listen for typing indicators
      socket.on('chat:userTyping', (typingUserData) => {
        if (typingUserData._id !== user._id) {
          setTypingUser(typingUserData);
        }
      });

      socket.on('chat:userStopTyping', () => {
        setTypingUser(null);
      });

      return () => {
        socket.off('chat:newMessage');
        socket.off('chat:userTyping');
        socket.off('chat:userStopTyping');
      };
    }
  }, [chatRoomId, socket, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    try {
      setLoading(true);
      let response;
      if (chatRoomId) {
        response = await chatService.getChatRoom(chatRoomId);
      } else if (taskId) {
        response = await chatService.getChatByTask(taskId);
      }
      
      if (response?.chatRoom) {
        setChatRoom(response.chatRoom);
        setMessages(response.chatRoom.messages || []);
        
        // Mark messages as read
        if (response.chatRoom._id) {
          await chatService.markAsRead(response.chatRoom._id);
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load chat');
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatRoom?._id) return;

    try {
      setSending(true);
      const response = await chatService.sendMessage(chatRoom._id, newMessage.trim());
      
      // Add message to local state
      setMessages((prev) => [...prev, response.message]);
      
      // Send via socket for real-time update to others
      socketSendMessage(chatRoom._id, response.message);
      
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (socket && chatRoom?._id) {
      socket.emit('chat:typing', {
        chatRoomId: chatRoom._id,
        user: { _id: user._id, name: user.name },
      });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:stopTyping', {
          chatRoomId: chatRoom._id,
          user: { _id: user._id },
        });
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-mits-blue animate-spin" />
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-secondary dark:text-text-dark-secondary">
        <p>No chat available for this task.</p>
        <p className="text-sm mt-2">Chat will be available once a student takes this task.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {chatRoom.participants
            ?.filter((p) => p._id !== user._id)
            .map((participant) => (
              <div key={participant._id} className="flex items-center space-x-2">
                <Avatar name={participant.name} size="small" />
                <div>
                  <p className="font-medium text-text-primary dark:text-text-dark">
                    {participant.name}
                  </p>
                  <span className={participant.role === 'teacher' ? 'badge-teacher' : 'badge-student'}>
                    {participant.role === 'teacher' ? 'Teacher' : 'Student'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message, index) => {
          const isOwnMessage = message.sender?._id === user._id || message.sender === user._id;
          const isSystemMessage = message.messageType === 'system';

          if (isSystemMessage) {
            return (
              <div key={message._id || index} className="flex justify-center">
                <span className="text-xs text-text-secondary dark:text-text-dark-secondary bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {message.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={message._id || index}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-[80%]`}>
                {!isOwnMessage && (
                  <Avatar
                    name={message.sender?.name || 'User'}
                    size="small"
                    className="flex-shrink-0"
                  />
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-mits-blue text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-text-primary dark:text-text-dark rounded-bl-none'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-text-secondary dark:text-text-dark-secondary'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUser && (
          <div className="flex items-center space-x-2 text-text-secondary dark:text-text-dark-secondary">
            <Avatar name={typingUser.name} size="small" />
            <span className="text-sm">{typingUser.name} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      {chatRoom.isActive !== false && (
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="input flex-1"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="btn-primary px-4"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>
      )}

      {chatRoom.isActive === false && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center text-text-secondary dark:text-text-dark-secondary">
          This chat is no longer active
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
