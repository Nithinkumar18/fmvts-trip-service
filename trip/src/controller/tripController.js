const logger = require('../loggers/logger');
const statusCons = require('../constants/httpConstants');
const infoMsg = require('../constants/responseInfo');
const tripService = require('../service/tripService');


let errMessage;

const initiateTrip = async(req,res) => {
    try{
      const trip_Cr = req.body;
      logger.info(`SERVICE - ${infoMsg.SERVICE} : ${req.URL}`);
      const _trip = await tripService.startTrip(trip_Cr);
      if(_trip._id){
        return res.status(statusCons.CREATED).json({Acknowledgement:infoMsg.TRIP_PLAN,tripDetails:_trip});
      }
      else if(_trip.Acknowledgement){
        return res.status(statusCons.BAD_REQUEST).json({Ack:_trip.Acknowledgement});
      }
      else{
         return res.status(statusCons.BAD_REQUEST).json({Acknowledgement:infoMsg.TRIP_FPLAN});
      }
    }
    catch(err){
         errMessage = err.message;
        return res.status(statusCons.INTERNAL_SERVER_ERROR).json({errMessage});

    }
}

const viewTrips = async(req,res) => {
    try{
       const trips = await tripService.viewTrip();
       logger.info(`SERVICE - ${infoMsg.SERVICE} : ${req.url}`);
       if(trips.length === 0){
          return res.status(statusCons.SUCCESS).json({Acknowledgement:TRIPS_DATA_NA});
       }
       else{
        return res.status(statusCons.SUCCESS).json({Acknowledgement:infoMsg.ALLTRIPS,trips});
       }

    }
    catch(err){
         errMessage = err.message;
        return res.status(statusCons.INTERNAL_SERVER_ERROR).json({errMessage});
    }

}

const updateTripDetails = async(req,res) => {
    try{
      const trip_Id = req.params.tId;
      const update_data = req.body;
      const trip_d = await tripService.updateTrip(trip_Id,update_data);
      logger.info(`SERVICE - ${infoMsg.SERVICE} : ${req.url}`);
      if(trip_d){
        return res.status(statusCons.SUCCESS).json({Acknowledgement:infoMsg.TRIP_UPDATE,lastUpdatedTime:trip_d.updatedTripDetails.updatedAt});
      }
      else{
        return res.status(statusCons.NOT_FOUND).json({Acknowledgement:infoMsg.TRIP_UPDATE_FAIL});
      }

    }
    catch(err){
       errMessage = err.message;
       return res.status(statusCons.INTERNAL_SERVER_ERROR).json({errMessage});
    }
}

const deleteTrip = async(req,res) => {
    try{
       const tripid = req.params.id;
       const dTrip = await tripService.retireTrip(tripid);
       logger.info(`SERVICE - ${infoMsg.SERVICE} : ${req.url}`);
       if(dTrip){
         return res.status(statusCons.SUCCESS).json({Acknowledgement:infoMsg.TRIP_DELETE,update_Time:dTrip.updatedAt});
       }
       else{
         return res.status(statusCons.NOT_FOUND).json({Acknowledgement:infoMsg.TRIP_DELETE_FAIL});
       }
    }
    catch(err){
      console.log(err);
        errMessage = err.message;
        return res.status(statusCons.INTERNAL_SERVER_ERROR).json({errMessage});
    }
}

const tripStatusUp = async(req,res) => {
    try{
       const _tid = req.params.t_id;
       const _status = req.body;
       const up_t_status = await tripService.updateTripStatus(_tid,_status);
       logger.info(`SERVICE - ${infoMsg.SERVICE} : ${req.url}`);
       if(up_t_status){
        return res.status(statusCons.SUCCESS).json({Acknowledgement:infoMsg.TRIP_STATUS,up_t_status});
       }
       else{
         return res.status(statusCons.NOT_FOUND).json({Acknowledgement:infoMsg.TRIP_FSTATUS});
       }
    }
    catch(err){
       errMessage = err.message;
       return res.status(statusCons.INTERNAL_SERVER_ERROR).json({errMessage});
    }
}

module.exports = {
    initiateTrip,
    viewTrips,
    updateTripDetails,
    deleteTrip,
    tripStatusUp

}