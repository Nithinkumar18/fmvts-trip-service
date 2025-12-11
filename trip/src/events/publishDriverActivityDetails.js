const amqp = require("amqplib");
const publishMsgInfo = require('../constants/responseInfo');
const logger = require('../loggers/logger');
require('dotenv').config();

const sendDriverActivityDetails = async(userId,activityStatus) => {
    let connection, channel;
    const sendActivityStatusQueue = process.env.QUEUE;
   try{
       connection = await amqp.connect(process.env.MESSAGE_QUEUE_URL);
       channel = await connection.createChannel();
       logger.info(`SERVICE - ${sendActivityStatusQueue} : ${publishMsgInfo.QUEUE_CONN_SUCESS}`);
       await channel.assertQueue(sendActivityStatusQueue,{durable: true});
       const activityData = {
           user_id: userId,
           availabilityStatus: activityStatus
       }
       channel.sendToQueue(sendActivityStatusQueue,Buffer.from(JSON.stringify(activityData)));
       logger.info(`SERVICE - ${publishMsgInfo.DRIVER_MSG_QUEUE} : ${publishMsgInfo.USER_EVENT}`);
   }
   catch(err){
    logger.error(`SERVICE - ${sendActivityStatusQueue} : ${publishMsgInfo.QUEUE_CON_FAIL}`, err);
     throw err;
   }
   finally{
        logger.info(`SERVICE - ${sendActivityStatusQueue} : ${publishMsgInfo.QUEUE_CON_CLOSE}`);
        await channel.close();
       await connection.close();
   }
}

module.exports = {sendDriverActivityDetails}