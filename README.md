![ChatIO](https://github.com/germanchuks/ChatIO/assets/chat-io-logo)

# ChatIO: Real-Time Communication Hub 🌐💬

ChatIO is a real-time chat application designed to facilitate instant communication between users. Whether for personal use or business collaboration, ChatIO offers a seamless and efficient messaging experience.

## Technologies 🚀

ChatIO is built using a modern and scalable technology stack:

- **Frontend:**
  - **React.js:** A JavaScript library for building user interfaces, ensuring a responsive and dynamic user experience.
  - **Socket.io-client:** Enables real-time, bidirectional communication between web clients and servers.
  - **Material-UI:** A popular React UI framework providing a set of components for building consistent and professional user interfaces.

- **Backend:**
  - **Express.js:** A minimal and flexible Node.js web application framework providing a robust set of features for web and mobile applications.
  - **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine, allowing for server-side scripting.
  - **Socket.io:** Facilitates real-time communication, enabling instant messaging and event-based interactions.

- **Database:**
  - **MongoDB:** A NoSQL database known for its high performance, high availability, and easy scalability.

## Features 🌟

- **Instant Messaging:** Send and receive messages in real-time, ensuring immediate communication.
- **Group Chats:** Create and manage group chats, making it easy to communicate with multiple users at once.
- **User Authentication:** Secure login and registration system using JWT (JSON Web Tokens) for authentication, ensuring user data is protected.
- **Message History:** Access past conversations and view message history with ease.
- **Online Status Indicators:** See who is online and available to chat in real-time.

## Architecture Diagram 🏗️

```
    ┌───────────────┐       ┌─────────────┐       ┌──────────────┐
    │   Frontend    │       │  Backend    │       │  Database    │
    │(React, Socket.io)│  ──▶ │(Express, Socket.io)│  ──▶ │  (MongoDB)   │
    └───────────────┘       └─────────────┘       └──────────────┘
            ▲                     ▲                     ▲
            │                     │                     │
            ▼                     ▼                     ▼
    ┌───────────────┐       ┌─────────────┐       ┌──────────────┐
    │   User Device │       │  Web Server │       │  Data Storage│
    └───────────────┘       └─────────────┘       └──────────────┘
```

## Target Users 🎯

- Individuals looking for a real-time chat solution for personal communication.
- Teams and businesses aiming to enhance collaboration through instant messaging.

## Installation and Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/ChatIO.git
    cd ChatIO
    ```

2. **Install dependencies:**
    ```sh
    npm install
    cd client
    npm install
    cd ..
    ```

3. **Setup environment variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string and other necessary environment variables:
    ```sh
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. **Start the development server:**
    ```sh
    npm run dev
    cd client
    npm start
    ```

5. **Visit the application:**
    Open your browser and go to `http://localhost:3000`

## Usage

- Visit the deployed app at [ChatIO](https://chatio-mdks.onrender.com).
- Create an account or log in.
- Start a chat with a friend or join a group chat.
- Enjoy real-time messaging with a seamless experience.

## Contributing

We welcome contributions to ChatIO! If you're interested in helping improve the app, please refer to the [Contributing.md](CONTRIBUTING.md) file for guidelines.

## Related Projects

- [Slack](https://slack.com/)
- [Discord](https://discord.com/)

## Authors 👥

- **Michael Chukwunwe** - [Github](https://github.com/stuckwithprogression)
- **Daniel German** - [Github](https://github.com/germanchuks)

## Screenshots 📸

### Homepage
![home](https://github.com/germanchuks/ChatIO/assets/homepage-screenshot)
