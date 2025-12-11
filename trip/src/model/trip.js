const mongoose = require('mongoose');
const tripSchema = new mongoose.Schema({

    source:{
        type: String,
        required: true
    },

    destination:{
        type: String,
        required: true
    },
    
    distance:{
        type: Number,
        required: true
    },

    vehicleId:{
        type: String,
    },

    driverId:{
        type:String
    },

    status:{
        type: String,
        required: true,
        enum: ["planned", "in-progress", "completed", "cancelled"],
        default: "planned"
    },

    plannedStartTime:{
        type: Date,
        required: true
    },

    startTime:{
        type: Date
    },
   
    plannedArrivalTime:{
        type:Date,
    },

    arrivalTime:{
        type: Date
    },

    delay:{
        type: Number
    },

    cancellationReason:{
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("trip",tripSchema)