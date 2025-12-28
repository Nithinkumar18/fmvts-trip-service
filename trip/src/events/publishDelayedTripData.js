const amqplib = require('amqplib');
require('dotenv').config();
const logger = require('../loggers/logger');
const pubDlydData = require('../constants/responseInfo');


const sendDelayedTripData = async(delayEventData) => {
    let connection, channel;
    try{
         connection = await amqplib.connect(process.env.MESSAGE_QUEUE_URL);
         channel  = await connection.createChannel();
          logger.info(`SERVICE - ${process.env.NOTIFICATION_QUEUE} : ${pubDlydData.QUEUE_CONN_SUCESS}`);
          await channel.assertQueue(process.env.NOTIFICATION_QUEUE,{durable: true});
          const event_Id = pubDlydData.EVENT_TYPE + Math.random().toString().slice(2,10).toUpperCase();
          const delayData = {
             tripId: delayEventData.updatedTripDetails._id,
             VehicleRegNum: delayEventData.updatedTripDetails.vehicleId,
             delayTime: delayEventData.updatedTripDetails.delay
          }
          const delayActivityData = {
              eventId: event_Id,
              eventType: pubDlydData.EVENT_TYPE,
              data: delayData
          }
          channel.sendToQueue(process.env.NOTIFICATION_QUEUE,Buffer.from(JSON.stringify(delayActivityData)));
          logger.info(`SERVICE - ${process.env.NOTIFICATION_QUEUE} : ${pubDlydData.DELAY_DATA_PUBLISH}`);

    }
    catch(err){
          logger.error(`SERVICE - ${process.env.NOTIFICATION_QUEUE} : ${err.message}`);
              throw err;
    }
    finally{
        await channel.close();
        await connection.close();
        logger.info(`SERVICE - ${process.env.NOTIFICATION_QUEUE} : ${pubDlydData.QUEUE_CON_CLOSE}`);
    }
}

module.exports = {
    sendDelayedTripData
}