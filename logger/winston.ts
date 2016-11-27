import * as winston from "winston";

export default new (winston.Logger)({
  exitOnError: false,
  transports: [
    new (winston.transports.Console)({
      level: 'error',
      name: 'console',
      timestamp: true,
      colorize: true,
      prettyPrint: true
    }),
    new (winston.transports.File)({
      filename: 'optimize.log',
      level: 'info',
      name: 'file',
      timestamp: true,
      prettyPrint: true
    })
  ]
});