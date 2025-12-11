const trip = require("../model/trip");
const logger = require("../loggers/logger");
const tripResInfo = require("../constants/responseInfo");
const axios = require('axios');
const {sendDriverActivityDetails} = require('../events/publishDriverActivityDetails');
require('dotenv').config();


const startTrip = async (tripData) => {
     try {
          const date = new Date();
          const plannedStartTime = date.toISOString();
          const tripInfo = { ...tripData, plannedStartTime };
          const driver_ID = tripInfo.driverId;
          logger.info(`SERVICE - ${tripResInfo.SERVICE} || ${tripResInfo.CONN_USER_SERVICE}`);
          const driverCurrentStatus = await axios.get(`${process.env.USER_CLIENT}/v1/user/${driver_ID}`);
          logger.http(`SERVICE - ${tripResInfo.SERVICE} || ${tripResInfo.CONN_USER_SERVICE_SUCC}`);
          if (driverCurrentStatus) {
               const status_c = driverCurrentStatus.data.userDetails;
               const cds = status_c.availabilityStatus;
               if (cds === tripResInfo.D_STATUS) {
                    logger.info(`SERVICE - ${tripResInfo.SERVICE} :${tripResInfo.TRIP_PLAN}`);
                    const trip_planned = await trip.create(tripInfo);
                    
                    if (trip_planned._id) {
                         return trip_planned;
                    }
               }
                else {
               return {
                    Acknowledgement: tripResInfo.CD_NOT_ACTIVE
               }
          }
          }
     }
     catch (err) {
          
          throw err;
     }
}

const updateTrip = async(trip_id,tripDetails) => {
     try{
      const updatedTripDetails = await trip.findByIdAndUpdate({'_id':trip_id},{$set:tripDetails},{new:true});
      logger.info(`SERVICE - ${tripResInfo.SERVICE} :${tripResInfo.TRIP_UPDATE}`);
      return {
          updatedTripDetails
      }
     }
     catch(err){
        throw err;
     }
}

const retireTrip = async(tripId) => {
     try{
        const retiredTrip = await trip.findByIdAndDelete({'_id':tripId});
         logger.info(`SERVICE - ${tripResInfo.SERVICE} :${tripResInfo.TRIP_DELETE}`);
         return retiredTrip;

     }
     catch(err){
        throw err;
     }
}

const updateTripStatus = async(Id,updateStatus) => {
     try{
         
         if(updateStatus.status === tripResInfo.TRIP_INP){
          const startTime = new Date();
          const startedData = {...updateStatus,startTime};
            const tripUptd = await trip.findByIdAndUpdate({'_id':Id},{$set:startedData},{new:true});
            if(tripUptd.status === tripResInfo.TRIP_INP){
               logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.UPTSTS_INP}`);
                await sendDriverActivityDetails(tripUptd.driverId,tripResInfo.DRIVER_BUSY_STATUS);
                logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.DRIVER_ACTIVITY_DETAILS_SENT_TO_QUEUE}`);
               return tripUptd;
             }
          }
          else if(updateStatus.status === tripResInfo.TRIP_CNC){
               const concuptd = await trip.findByIdAndUpdate({'_id':Id},{$set:updateStatus},{new:true});
               if(concuptd.status === tripResInfo.TRIP_CNC){
                  logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.UPTSTS_CNC}`);
                await sendDriverActivityDetails(concuptd.driverId,tripResInfo.DRIVER_ACTIVE_STATUS);
                logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.DRIVER_ACTIVITY_DETAILS_SENT_TO_QUEUE}`); 
                  return concuptd;
               }
          }
          else if(updateStatus.status === tripResInfo.TRIP_COMP){
               const arrivalTime = new Date().toISOString();
               const dataUPs = {...updateStatus,arrivalTime};
               const arrvupd = await trip.findByIdAndUpdate({'_id':Id},{$set:dataUPs},{new:true});
               logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.UPTSTS_CMP}`); 
               const actualArrivalTime = new Date(arrvupd.updatedAt);
               const planArrivalTime = new Date(arrvupd.plannedArrivalTime);
               const timeDifference = (actualArrivalTime.getTime() - planArrivalTime.getTime()) / (1000 * 60);
                logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.DELAY_CHECK}: ${Id} : ${arrvupd.source} ${tripResInfo.TO_LOGO} ${arrvupd.destination}`);
               if(timeDifference > 0){
                const delay = Math.round(timeDifference);
                const delyInfo = await updateTrip(Id,{delay});
                 logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.DELAY_CONFIRMED} : ${timeDifference}`); 
                await sendDriverActivityDetails(delyInfo.updatedTripDetails.driverId,tripResInfo.DRIVER_ACTIVE_STATUS);
                logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.DRIVER_ACTIVITY_DETAILS_SENT_TO_QUEUE}`); 
                 return delyInfo;
                    
               }
               else{
                    logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.DELAY_NTCNF}`); 
                    await sendDriverActivityDetails(delyInfo.updatedTripDetails.driverId,tripResInfo.DRIVER_ACTIVE_STATUS);
                    logger.info(`SERVICE - ${tripResInfo.SERVICE} : ${tripResInfo.DRIVER_ACTIVITY_DETAILS_SENT_TO_QUEUE}`); 
                    return arrvupd;
               }

          }

     }
     catch(err){
          console.log(err);
         throw err;
     }
}

const viewTrip = async() => {

     try{
        const _allTrips = await trip.find();
          logger.info(`SERVICE - ${tripResInfo.SERVICE} :${tripResInfo.ALLTRIPS}`);
          return _allTrips;
     }
     catch(err){
        throw err;
     }
}

module.exports = {
     startTrip,
     updateTrip,
     retireTrip,
     updateTripStatus,
     viewTrip

}