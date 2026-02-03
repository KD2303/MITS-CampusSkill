import ChatRoom from '../models/ChatRoom.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get chat room by task
// @route   GET /api/chat/task/:taskId
// @access  Private
export const getChatByTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user is part of the task
  const isParticipant =
    task.postedBy.toString() === req.user.id ||
    (task.takenBy && task.takenBy.toString() === req.user.id);

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this chat',
    });
  }

  const chatRoom = await ChatRoom.findOne({ task: req.params.taskId })
    .populate('participants', 'name email role avatar')
    .populate('messages.sender', 'name email role avatar');

  if (!chatRoom) {
    return res.status(404).json({
      success: false,
      message: 'Chat room not found',
    });
  }

  res.status(200).json({
    success: true,
    chatRoom,
  });
});

// @desc    Get chat room by ID
// @route   GET /api/chat/:id
// @access  Private
export const getChatRoom = asyncHandler(async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.id)
    .populate('participants', 'name email role avatar')
    .populate('messages.sender', 'name email role avatar')
    .populate('task', 'title status');

  if (!chatRoom) {
    return res.status(404).json({
      success: false,
      message: 'Chat room not found',
    });
  }

  // Check if user is a participant
  const isParticipant = chatRoom.participants.some(
    (p) => p._id.toString() === req.user.id
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this chat',
    });
  }

  res.status(200).json({
    success: true,
    chatRoom,
  });
});

// @desc    Send message
// @route   POST /api/chat/:id/message
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, messageType = 'text' } = req.body;

  const chatRoom = await ChatRoom.findById(req.params.id);

  if (!chatRoom) {
    return res.status(404).json({
      success: false,
      message: 'Chat room not found',
    });
  }

  // Check if user is a participant
  const isParticipant = chatRoom.participants.some(
    (p) => p.toString() === req.user.id
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to send messages in this chat',
    });
  }

  // Check if chat is active
  if (!chatRoom.isActive) {
    return res.status(400).json({
      success: false,
      message: 'This chat room is no longer active',
    });
  }

  const message = {
    sender: req.user.id,
    content,
    messageType,
    readBy: [req.user.id],
  };

  chatRoom.messages.push(message);
  chatRoom.lastMessage = {
    content,
    sender: req.user.id,
    timestamp: new Date(),
  };

  await chatRoom.save();

  // Get the newly added message with populated sender
  const updatedChatRoom = await ChatRoom.findById(req.params.id)
    .populate('messages.sender', 'name email role avatar');

  const newMessage = updatedChatRoom.messages[updatedChatRoom.messages.length - 1];

  res.status(201).json({
    success: true,
    message: newMessage,
  });
});

// @desc    Mark messages as read
// @route   PUT /api/chat/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.id);

  if (!chatRoom) {
    return res.status(404).json({
      success: false,
      message: 'Chat room not found',
    });
  }

  // Check if user is a participant
  const isParticipant = chatRoom.participants.some(
    (p) => p.toString() === req.user.id
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized',
    });
  }

  // Mark all messages as read by this user
  chatRoom.messages.forEach((message) => {
    if (!message.readBy.includes(req.user.id)) {
      message.readBy.push(req.user.id);
    }
  });

  await chatRoom.save();

  res.status(200).json({
    success: true,
    message: 'Messages marked as read',
  });
});

// @desc    Get user's chat rooms
// @route   GET /api/chat/my-chats
// @access  Private
export const getMyChats = asyncHandler(async (req, res) => {
  const chatRooms = await ChatRoom.find({
    participants: req.user.id,
  })
    .populate('participants', 'name email role avatar')
    .populate('task', 'title status')
    .populate('lastMessage.sender', 'name')
    .sort({ updatedAt: -1 });

  // Add unread count for each chat
  const chatsWithUnread = chatRooms.map((chat) => {
    const unreadCount = chat.messages.filter(
      (msg) => !msg.readBy.includes(req.user.id)
    ).length;

    return {
      ...chat.toObject(),
      unreadCount,
    };
  });

  res.status(200).json({
    success: true,
    count: chatRooms.length,
    chatRooms: chatsWithUnread,
  });
});
