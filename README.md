# Chatzy

**Chatzy** is a full-stack **MERN** chat application built with **JavaScript**, offering real-time messaging capabilities powered by **Socket.IO**. It features secure user authentication, private messaging, group chats, and a sleek, responsive user interface, making it a complete solution for modern web-based communication.

**Live Website**: [Chatzy](https://chatzy-five.vercel.app)

---

## Features

### Frontend

- **Authentication**:
  - Signup and login using JWT for secure sessions.
- **Real-Time Messaging**:
  - Instant chat and profile updates using **Socket.IO**.
  - Supports both one-on-one and group chats.
- **Chat Features**:
  - Create, delete, and manage group chats.
  - Search users to start new conversations.
  - Send/receive messages in real-time.
- **UI/UX**:
  - Responsive layout supporting both desktop and mobile views.
  - Smooth transitions and intuitive design.

### Backend

- **User Management**:
  - Secure signup/login with password hashing (bcrypt).
  - JWT-based authentication and route protection.
- **Chat Management**:
  - RESTful API to create, fetch, and manage chats.
  - Socket.IO integration for real-time messaging.
- **Message Storage**:
  - Messages are saved in MongoDB for history and retrieval.
- **Notifications**:
  - Real-time typing indicators and message delivery feedback.

---

## Tech Stack

### Frontend

- **React.js**
- **Tailwind CSS**
- **Axios**
- **React Router**
- **Socket.IO Client**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO**
- **JWT** & **bcrypt**
- **JavaScript**

---

## Installation & Setup

### Prerequisites

- **Node.js** (v14 or above)
- **MongoDB** (Local or MongoDB Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/krish3742/Chatzy.git
```

---

### 2. Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd ./Backend/
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following variables:

   ```env
   PORT=3005
   NODE_ENV=development
   SECRET_KEY=Your_Secret_Key
   MONGODB_URI=MongoDB_Connection_String
   CLOUDINARY_CLOUD_NAME=Cloud_Name
   CLOUDINARY_API_KEY=Cloud_API_Key
   CLOUDINARY_API_SECRET=Cloud_API_Secret_Key
   CORS_ORIGIN_URL=Frontend_URL
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd ./Frontend/
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following variables:

   ```env
   VITE_BACKEND_URL=Backend_URL
   VITE_BASE_URL=Backend_Base_URL
   ```

4. Start the frontend server:

   ```bash
   npm run dev
   ```

---

## Future Enhancements

- **Media Sharing**: Send images, documents, or voice messages.
- **Message Reactions**: Add emoji reactions to messages.
- **Message Deletion & Edit**: Let users delete or edit their messages.
- **Delivery & Seen Status**: Indicate when a message is delivered and seen.

---

## License

This project is licensed under the **MIT License**.

---

## Contact

- **Author**: Kshitij Agrawal
- **Email**: akshitij70@gmail.com
- **GitHub**: [@krish3742](https://github.com/krish3742)
