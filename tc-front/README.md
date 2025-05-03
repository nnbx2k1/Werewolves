This is the frontend for the Werewolves real-time communication platform. It supports features such as end-to-end encrypted messaging, real-time notifications, document sharing, and digital signature workflows.

✨ Features
🔒 Real-time messaging with Socket.IO

🔐 End-to-end encryption for messages

👥 User authentication and authorization

📄 Document sharing and management

✍️ Digital signature support

🛎️ Real-time notifications

🧱 Modular and scalable UI with React

🔐 Integrated rate limiting & security features

📜 Audit logging (via backend integration)

🧰 Tech Stack
React

Tailwind CSS

Socket.IO Client

Axios

TanStack Query (React Query) for data fetching

React Router

Context API for global state

🚀 Getting Started
Prerequisites
Ensure the following are installed on your machine:

Node.js (v14 or higher)

npm or yarn

Git

📦 Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/nnbx2k1/Werewolves.git
cd werewolves/client
Install dependencies:

bash
Copy
Edit
npm install
# or
yarn install
Environment Variables

Create a .env file in the client directory:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
⚠️ Make sure the server is running on port 5000 or update accordingly.

🧪 Running the Project
Development Mode
bash
Copy
Edit
npm run dev
# or
yarn dev
Production Build
bash
Copy
Edit
npm run build
🧭 Project Structure
bash
Copy
Edit
client/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and icons
│   ├── components/      # Reusable components
│   ├── contexts/        # Global state (auth, socket)
│   ├── hooks/           # Custom hooks (e.g. useAuth, useMessages)
│   ├── pages/           # Main pages/views
│   ├── services/        # API calls and socket services
│   ├── utils/           # Helper functions
│   ├── App.jsx          # App entry
│   ├── main.jsx         # Main entry point
├── .env                 # Environment variables
└── package.json         # Project dependencies
