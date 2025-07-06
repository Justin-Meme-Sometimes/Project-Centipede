require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const bulletinRoutes = require('./routes/bulletinRoutes');

const auth = require('./middleware/auth');
const upload = require('./middleware/multer');

const cookieParser = require('cookie-parser');
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/groups', auth, groupRoutes);
app.use('/api/auth', loginRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/bulletin', bulletinRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/api/test', (req, res) => { 
  res.json({success: true, message:"Backend + MongoDB connected"});
});