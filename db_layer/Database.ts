import * as mongodb from "mongodb";
import config from "../config/config";
import logger from "../logger/winston";
import DbLayerError from "../Error/DbLayerError";

const url = config.get('mongodb:url');
const MongoClient = mongodb.MongoClient;

export default class Database {
  db: mongodb.Db;
  connectionString: string;

  constructor(connectionURL?: string) {
    if (connectionURL) {
      this.connectionString = connectionURL;
    } else {
      this.connectionString = url;
    }
  }

  connect(connectionURL?: string): Promise<mongodb.Db> {
    return new Promise((resolve, reject) => {
      if (connectionURL) {
        this.connectionString = connectionURL;
      }
      if (!this.connectionString) {
        logger.error('Empty database connection string');
        return reject(new DbLayerError('Empty database connection string'));
      }
      logger.info('Database connect string', this.connectionString);

      MongoClient.connect(this.connectionString, function (err: mongodb.MongoError, db: mongodb.Db) {
        if (err) {
          logger.error('Database connection error!', {error: err});
          return reject(new DbLayerError(err));
        }
        logger.debug("Connected correctly to database server");

        return resolve(this.db = db);
      })
    });
  }

  close() {
    return this.db.close();
  }
}

