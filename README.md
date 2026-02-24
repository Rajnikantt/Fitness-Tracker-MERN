# 
🏋️Workout-Tracker-MERN
A full-stack workout tracking application built with the MERN stack.  
Users can create programs, add exercises, log workouts, and track their fitness progress.
---
## 🚀 Features
- 🔐 User authentication (Login / Register) with JWT
- 🏋️ Create and manage workout programs
- 📝 Add exercises and track sets, reps, weight, rest time, RPE
- 📊 Dashboard with workout statistics
- 📚 Exercise library (Admin can manage exercises)
- 👥 Admin panel to manage users
- 🌐 REST API built with Node.js & Express
- 💾 Data stored in MongoDB
- ⚛️ Frontend built with React
---
## 🛠️ Tech Stack
**Frontend:**
- React
- React Router
- Axios
- Tailwind CSS + Custom CSS

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
---
## 📁 Project Structure
```bash
workout-tracker/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.js
│       ├── components/
│       │   └── Navbar.js
│       ├── context/
│       │   └── AuthContext.js
│       └── pages/
│           ├── Login.js
│           ├── Register.js
│           ├── Dashboard.js
│           ├── Exercises.js
│           ├── Programs.js
│           ├── ProgramDetail.js
│           ├── CreateProgram.js
│           ├── Workouts.js
│           ├── CreateWorkout.js
│           └── AdminUsers.js
├── README.md
└── package.json (optional / root if you use one)

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/workout-tracker.git
cd iron-workout-tracker



cd backend
npm install

Create a .env file inside the backend folder:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/workout-tracker
JWT_SECRET=your_secret_key
NODE_ENV=development

Start the backend server:
npm run dev
# or
npm start
Backend will run on: http://localhost:5000

Open a new terminal:
cd frontend
npm install
npm start
Frontend will run on: http://localhost:3000
