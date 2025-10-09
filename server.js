const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/complex');


const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => console.log('Connected to MongoDB'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
