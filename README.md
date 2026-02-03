# MITS CampusSkill 🎓

A comprehensive student talent marketplace platform where teachers and students collaborate through tasks, chat, and a credit-based reward system.

![MITS CampusSkill Banner](https://via.placeholder.com/800x200/1F2A8A/FFFFFF?text=MITS+CampusSkill)

## 🌟 Features

### For Students
- **Browse Tasks**: Discover tasks posted by teachers and peers
- **Take & Complete Tasks**: Work on real projects and earn credit points
- **Build Portfolio**: Showcase completed work on your profile
- **Real-time Chat**: Communicate with task creators
- **Leaderboard**: Compete with peers and climb the rankings

### For Teachers
- **Post Tasks**: Create tasks with credit point rewards
- **Review Submissions**: Approve or request revisions
- **Rate Students**: Provide feedback and ratings
- **Monitor Progress**: Track task completion

### Platform Features
- 🔐 JWT Authentication with role-based access
- 💬 Real-time chat via Socket.IO
- 🌙 Dark mode support
- 📱 Fully responsive design
- ⭐ Rating and review system
- 🏆 Gamified credit points system

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Socket.IO Client** for real-time features
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.IO** for real-time communication
- **bcryptjs** for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd "MITS CampusSkill"
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `PORT` - Server port (default: 5000)

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment**
   Edit `.env` if needed:
   - `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
MITS CampusSkill/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   ├── userController.js
│   │   │   └── chatController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   └── ChatRoom.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── chatRoutes.js
│   │   ├── utils/
│   │   │   ├── asyncHandler.js
│   │   │   └── tokenUtils.js
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Colors
- **MITS Blue**: `#1F2A8A` (Primary)
- **Orange Accent**: `#F57C00` (Secondary)
- **Green Success**: `#2E7D32`
- **Background Light**: `#FAFAFA`
- **Background Dark**: `#121212`

### Typography
- Font Family: Inter, system fonts
- Responsive font sizes with Tailwind

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/take` - Take a task
- `POST /api/tasks/:id/submit` - Submit task
- `POST /api/tasks/:id/review` - Review submission
- `POST /api/tasks/:id/reassign` - Reassign task

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id/tasks` - Get user's tasks

### Chat
- `POST /api/chat/room` - Get/create chat room
- `GET /api/chat/room/:roomId` - Get room details
- `POST /api/chat/message` - Send message
- `GET /api/chat/messages/:roomId` - Get messages

## 🔌 Socket Events

### Client → Server
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message

### Server → Client
- `receive_message` - New message received
- `user_joined` - User joined room
- `user_left` - User left room
- `task_updated` - Task status changed

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend (Render/Railway)
1. Set environment variables
2. Deploy from GitHub
3. Ensure MongoDB Atlas connection

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production backend
2. Build command: `npm run build`
3. Output directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

**MITS CampusSkill Development Team**

---

Made with ❤️ for MITS Campus

🌐 [Visit CampusSkill](http://localhost:5173)
