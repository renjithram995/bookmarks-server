const express = require('express');
const connectDB = require('./dbadaptor/dbhandler');
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const healthCheckRoutes = require('./routes/healthCheck');
const securityHandler = require('./securityHandler');
require('dotenv').config();
const { PORT } = require('./config');

const app = express();

securityHandler(app);
connectDB();

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/github', githubRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/health-check', healthCheckRoutes);

app.listen(PORT, console.log.bind(console, `Server started on port ${PORT}`) );
