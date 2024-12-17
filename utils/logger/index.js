require("dotenv").config();
const developmentLogger = require("./developmentLogger");
// const productionLogger = require('./productionLogger')  //FOR PRODUCTION LEVEL CODE

let logger = null;
logger = developmentLogger();
if (process.env.LOG_LEVEL === "Development") {
}

// FOR PRODUCTION LEVEL CODE
// else if(process.env.LOG_LEVEL === 'Production'){
//   logger = productionLogger();
// }
module.exports = logger;

// const { transports, createLogger, format } = require("winston");
// const { combine, timestamp, label, printf, prettyPrint, json } = format;

// const logger = createLogger({
//     level: 'info',
//     format: combine(
//         label({ label: 'winston log'}),
//         timestamp({
//             format: 'DD-MM-YYYY HH:mm:ss'
//         }),
//         prettyPrint()
//         // json()
//     ),

//     defaultMeta: { service: 'user-service' },
//     // transports: [
//             //
//             // - Write all logs with importance level of `error` or less to `error.log`
//             // - Write all logs with importance level of `info` or less to `combined.log`
//             //
//             // new winston.transports.File({ filename: 'error.log', level: 'error' }),
//             // new winston.transports.File({ filename: 'combined.log' }),

//     transports: [
//         new transports.File({
//             filename: "testLogs.log",
//             level,
//             format
//         })
//     ]
// })

// //                 new DailyRotateFile({
// //                         filename: 'logs/combined-%DATE%.log',
// //                         datePattern: 'DD-MM-YYYY',
// //                         maxFiles: '30d'
// //                 }),
// //                 new DailyRotateFile({
// //                         filename: 'logs/error-%DATE%.log',
// //                         datePattern: 'DD-MM-YYYY',
// //                         maxFiles: '30d',
// //                         level: 'error'
// //                 })
// //         ],
// //         exceptionHandlers: [
// //                 new DailyRotateFile({
// //                         filename: 'logs/exceptions-%DATE%.log',
// //                         datePattern: 'DD-MM-YYYY',
// //                         maxFiles: '30d'
// //                 })
// //         ],
// //         rejectionHandlers: [
// //                 new DailyRotateFile({
// //                         filename: 'logs/rejections-%DATE%.log',
// //                         datePattern: 'DD-MM-YYYY',
// //                         maxFiles: '30d'
// //                 })
// //         ]

// // });

// //
// // If we're not in production then log to the `console` with the format:
// // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// //
// // if (process.env.NODE_ENV !== 'production') {

// //         logger.add(new winston.transports.Console({
// //                 // format: winston.format.simple(),
// //                 format: combine(
// //                         label({ label: 'info' }),
// //                         prettyPrint()
// //                 )
// //         }));

// // }

// // export default logger;
// module.exports = logger;
