const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./src/loggers/logger');
const logMsg = require('./src/constants/responseInfo');
app.use(express.json());
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
   logger.info(`${logMsg.SERVICE} connected to database ✅`)
   app.listen(process.env.PORT, () => {
       logger.info(`${logMsg.SERVICE} started on PORT ${PORT} 🌎🔄🚚 `);
   })
})
.catch((err) => {
     logger.error(`${logMsg.SERVICE} failed  to connect  database `,err);
})

