const amqp = require('amqplib');
const publishMsgInfo = require('../constants/responseInfo');
const logger = require('../loggers/logger');
require('dotenv').config();


const syncTripToAssignedVehicle = async (vehicleId, distanceTravelled) => {

    let connection, channel;
    const tripSyncQUeue = process.env.TRIP_DATA_QUEUE;
    try {
        connection = await amqp.connect(process.env.MESSAGE_QUEUE_URL);
        channel = await connection.createChannel();
        logger.info(`SERVICE - ${tripSyncQUeue} : ${publishMsgInfo.QUEUE_CONN_SUCESS}`);
        await channel.assertQueue(tripSyncQUeue, { durable: true });
        const tripData = {
            vehicle_id: vehicleId,
            distance: distanceTravelled
        }
        channel.sendToQueue(tripSyncQUeue, Buffer.from(JSON.stringify(tripData)));
        logger.info(`SERVICE - ${publishMsgInfo.DRIVER_TRIP_QUEUE} : ${publishMsgInfo.TRIP_INFO_EVENT}`);
    }
    catch (err) {
        logger.error(`SERVICE - ${tripSyncQUeue} : ${publishMsgInfo.QUEUE_CON_FAIL}`, err);
        throw err;
    }
    finally {
        logger.info(`SERVICE - ${tripSyncQUeue} : ${publishMsgInfo.QUEUE_CON_CLOSE}`);
        await channel.close();
        await connection.close();
    }
}

module.exports = {syncTripToAssignedVehicle}
