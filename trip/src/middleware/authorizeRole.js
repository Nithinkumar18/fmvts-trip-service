const logger = require('../loggers/logger');
const statusConstants = require('../constants/httpConstants');
const resInfo = require('../constants/responseInfo');

const validateUserRole = (allowedRoles) => {
    return (req,res,next) => {
        try{
           const role = req.headers['x-user-role'];
           if(allowedRoles.includes(role)){
              logger.info(`SERVICE - ${resInfo.SERVICE} :${resInfo.ROLE_VALIDATION}`);
              next();
           }
           else{
             logger.info(`SERVICE: ${resInfo.SERVICE} || MESSAGE: ${resInfo.ACCESS_DENIED} `);
            return res.status(statusConstants.UNAUTHORIZED).json({message:resInfo.ACCESS_DENIED});
           }
        }
        catch(err){
           return res.status(statusConstants.INTERNAL_SERVER_ERROR).json({message:resInfo.ERROR_VALIDATING_ROLE});
    
        }
    }
}

module.exports = {validateUserRole}