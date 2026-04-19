# 🏥 HealthSync

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.2-38B2AC?logo=tailwind-css)

**HealthSync** is a modern, full-stack healthcare platform designed to streamline medical workflows. It connects patients, doctors, blood donors, and administrators into one synchronized ecosystem. Experience incredibly fast loading times, a sleek boxed UI design, and deep administrative control.

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities tailored for:
  - 👤 **Patients / Users:** Book appointments, order medicines, tracking medical health.
  - ⚕️ **Doctors:** Manage schedules, view patient histories, and handle remote tracking.
  - 🩸 **Blood Donors:** Monitor donation requests, view eligibility, and respond to emergencies.
  - 🛡️ **System Administrators:** Complete oversight with master controls (Admin accounts require secure approval).
- **Premium UI & UX:** A "WOW"-factor graphical interface utilizing absolute latest trends including a custom boxed layout, glassmorphic elements, modern gradients, and smooth stagger animations powered by `framer-motion`.
- **Integrated Pharmacy:** Browse and purchase medicines with real-time stock updating.
- **Blood Bank Connectivity:** A dedicated module for patients and donors to seamlessly request and fulfill blood requirements.
- **Secure Authentication:** JWT-driven credential authorization ensuring end-to-end security.

---

## 🛠️ Technology Stack

**Frontend:**
- **React.js (v19):** Utilizing modern hooks and suspense boundaries.
- **Vite:** Next-generation frontend tooling for instantaneous HMR.
- **Tailwind CSS (v4):** Utility-first CSS framework for ultra-fast styling.
- **Framer Motion:** Declarative animations for incredibly smooth component mounting.
- **Lucide React:** Beautifully consistent SVG iconography.
- **Recharts:** Composable charting library for admin data visualization.

**Backend:**
- **Node.js & Express.js:** Scalable and asynchronous event-driven server environment.
- **MongoDB & Mongoose:** Flexible NoSQL database with strict schema validation.
- **JWT (JSON Web Tokens):** Safe and secure stateless session management.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine.
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/HealthSync.git
   cd HealthSync
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup (.env):**
   Create a `.env` file in the root of the **server** directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/healthsync
   JWT_SECRET=your_jwt_super_secret_key
   ```
   *(Note: Ensure your local MongoDB instance is running, or replace the URI with your MongoDB Atlas connection string.)*

### Running the Application

The project comes with a useful root `package.json` that uses concurrently-like behavior allowing you to spin up the entire stack with one command from the project root.

From the root directory of the project, run:
```bash
npm start
```
This will launch:
- The Express Server on `http://localhost:5000`
- The React Vite Client on `http://localhost:5173`

*(Alternatively, you can run `npm run server` and `npm run client` in separate terminal windows.)*

---

## 📂 Project Structure

```text
HealthSync/
├── client/                 # React Frontend Application (Vite)
│   ├── public/             # Static Assets
│   ├── src/                
│   │   ├── api/            # Axios API Configuration and API Calls
│   │   ├── components/     # Reusable UI Components (Navbar, Footer, etc.)
│   │   ├── pages/          # Full Page Views (Auth, Pharmacy, Admin, etc.)
│   │   ├── App.jsx         # Central Route Management
│   │   └── main.jsx        # React Entry Point
│   ├── package.json        
│   └── vite.config.js      
├── server/                 # Node.js Express Backend
│   ├── controllers/        # Route Logic & Business Logic Controllers
│   ├── models/             # Mongoose Database Schemas (User, Appointment, etc)
│   ├── routes/             # Express API Endpoints
│   ├── middleware/         # Custom Middleware (Auth, Roles)
│   ├── App.js              # Server Initialization & DB Connection
│   └── package.json        
├── package.json            # Root configuration for simultaneous startup
└── README.md
```

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are strictly **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Heal Smarter. Connect Faster. Manage Anywhere.*
