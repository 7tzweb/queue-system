const express = require('express');
const morgan = require('morgan');
const queueRoutes = require('./routes/queueRoutes');
const agentRoutes = require('./routes/agentRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/queue', queueRoutes);
app.use('/agent', agentRoutes);

app.use(errorHandler);

module.exports = app;
