# Project-Centipede

A MERN stack application using Node.js, Express.js, MongoDB, and React.

## Prerequisites

Install the following:

- Git
- Node.js (v18 or higher)
- npm
- MongoDB (local or Atlas)
- nodemon (optional, for backend dev)

## Project Structure

Project-Centipede/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
└── frontend/
    └── React app files

## Backend Setup
```
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
MONGO_URI=mongodb://localhost:27017/centipede  
PORT=5000
```

Start the backend:

```npm run dev```   

## Frontend Setup

```
cd frontend  
npm install  
npm start
```

## Running Both

Use two terminals:

# Terminal 1  

```
cd backend  
npm run dev
```

# Terminal 2  

```
cd frontend  
npm start
```

## Access Points

- Frontend: ```http://localhost:3000```  
- Backend API: ```http://localhost:5000```

## API Test

Check:  
```GET http://localhost:5000/```

Expected response:  
API Running

## Notes

- MongoDB must be running: `sudo service mongod start`  
- The `centipede` database is created automatically on use
