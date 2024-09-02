const express = require('express');
const connectDB = require('./dbadaptor/dbhandler');
const securityHandler = require('./securityHandler');
const routesHandler = require('./routes/routesHandler');
const { PORT } = require('./config');
const cronJob = require('./cronjob.js');

const app = express();

securityHandler(app);
connectDB();

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

routesHandler(app);

cronJob();

app.listen(PORT, console.log.bind(console, `Server started on port ${PORT}`) );
