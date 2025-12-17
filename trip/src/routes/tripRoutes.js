const express = require('express');
const router = express.Router();
const tripController = require('../controller/tripController');
const {validateUserRole} = require('../middleware/authorizeRole');

router.post('/initiate',validateUserRole(["fleet_manager"]),tripController.initiateTrip);
router.get('/trips',validateUserRole(["fleet_manager","admin"]),tripController.viewTrips);
router.get('/reports',validateUserRole(["admin"]),tripController.reports);
router.put('/updatetrip/:tId',validateUserRole(["fleet_manager"]),tripController.updateTripDetails);
router.put('/status/:t_id',validateUserRole(["fleet_manager"]),tripController.tripStatusUp);
router.delete('/retire/:id',validateUserRole(["fleet_manager","admin"]),tripController.deleteTrip);

module.exports = router;


