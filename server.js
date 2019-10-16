const express = require('express');
const app = express();
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

//DB Confid
const db = require('./config/keys').mongoURI;

//Mongodb connection
mongoose
.connect(db)
.then( () => console.log('MongoDB Connected'))
.catch(err => console.log(err));

//use routes
app.use('/api/users', users)
app.use('/api/profiles', profile)
app.use('/api/posts', posts)

app.get('/', (req,res) => res.send('Hello Woke'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));