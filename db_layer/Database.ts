import * as mongodb from "mongodb";
import config from "../config/config";
import logger from "../logger/winston";
import DbLayerError from "../Error/DbLayerError";

const MongoClient = mongodb.MongoClient;

export default class Database {

  static URL = config.get('mongodb:url');

  static connect(connectionURL?: string): Promise<mongodb.Db> {
    return new Promise((resolve, reject) => {

      let connectionString: string;

      if (connectionURL) {
        connectionString = connectionURL;
      } else {
        connectionString = Database.URL;
      }

      if (!connectionString) {
        logger.error('Empty database connection string');
        return reject(new DbLayerError('Empty database connection string'));
      }
      logger.info('Database connect string', connectionString);

      MongoClient.connect(connectionString, function (err: mongodb.MongoError, db: mongodb.Db) {
        if (err) {
          logger.error('Database connection error!', {error: err});
          return reject(new DbLayerError(err));
        }
        logger.debug("Connected correctly to database server");

        return resolve(db);
      })
    });
  }

  static getCollection(db: mongodb.Db, collectionName: string): mongodb.Collection {
      return db.collection(collectionName);
  }

  static close(db: mongodb.Db) {
    return db.close();
  }
}

