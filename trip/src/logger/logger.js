const {createLogger, format, transports} = require('winston');


const customLevels = {
    levels:{

    
       error: 0,
       info: 2,
       http: 3
    },
    colors:{
        error: 'red',
        info: 'green',
        http: 'blue'
    }
}

const logger = createLogger({

    levels: customLevels.levels,
    level: 'http',
    format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({timestamp,level,message}) => `${timestamp} ${level}: ${message}`)
    ),

    transports:[
         new transports.Console()
    ]
});

module.exports = logger;