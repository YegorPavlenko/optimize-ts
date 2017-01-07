import * as mongodb from "mongodb";
import config from "../config/config";
import logger from "../logger/winston";
import DbLayerError from "../Error/DbLayerError";

const MongoClient = mongodb.MongoClient;
let database: mongodb.Db = null;

export default class Database {

  static URL = config.get('mongodb:url');

  static connect(connectionURL?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('connect() database', database);
      if (database instanceof mongodb.Db) {
        return resolve(database);
      }
      const URL = config.get('mongodb:url');
      let connectionString: string;

      if (connectionURL) {
        connectionString = connectionURL;
      } else {
        connectionString = URL;
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
        database = db;
        return resolve();
      })
    });
  }

  // static getCollection(db: mongodb.Db, collectionName: string): mongodb.Collection {
  //     return db.collection(collectionName);
  // }

  static get(): Promise<mongodb.Db> {
    return new Promise((resolve, reject) => {
      if (database instanceof mongodb.Db) {
        return resolve(database);
      } else {
        Database.connect()
          .then(() => {
            return resolve(database)
          })
          .catch((err) => {
            return reject(err)
          });
      }
    })
  }

  static close(): Promise<void> {
    return new Promise((resolve, reject) => {
      database.close()
        .then(() => {
          database = null;
          resolve();
        })
        .catch((err) => {
          database = null;
          reject(err);
        });
    })
  }
}

