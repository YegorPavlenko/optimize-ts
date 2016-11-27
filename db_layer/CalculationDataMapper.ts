import * as mongodb from "mongodb";
import config from "../config/config";
import logger from "../logger/winston";
import DbLayerError from "../Error/DbLayerError";
import Database from "./Database";
import Calculation from "../models/Calculation";

let curDb: Database;

export default class CalculationDataMapper {

  static getClassName(){ return 'CalculationDataMapper'; }

  static getCollection(connectionURL?: string): Promise<mongodb.Collection> {
    return new Promise((resolve, reject) => {
      const calculationsCollectionName = 'calculations';
      // let collection: mongodb.Collection;
      curDb = new Database(connectionURL);
      curDb.connect()
        .then(db => {
          resolve(db.collection(calculationsCollectionName));
        })
        .catch(err => {
          reject(err);
        })
    })
  }

  static checkExistence(hash: string): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (!hash) {
        logger.error('Empty parameter "hash"', {className: CalculationDataMapper.getClassName(), methodName: "checkExistence"});
        return reject('Empty parameter "hash"');
      }
      CalculationDataMapper.getCollection()
        .then(collection => {
          if (!collection) {
            throw (new DbLayerError('No connection!'));
          }
          collection.find({'hash': hash}).toArray(function (err: mongodb.MongoError, docs: Array<Object>) {
            curDb.close()
              .then(result => {
                logger.debug("Database connection closed!", {result: result})
              })
              .catch(err => {
                logger.error("Database connection have not closed!", {error: err})
              });
            if (err) {
              logger.error(`Collection ${collection.collectionName} find error!`, {error: err});
              return reject(new DbLayerError(err));
            }
            logger.info("Found the following records: ", docs);
            if (docs.length === 0) {
              return resolve(false);
            } else if (docs.length === 1) {
              return resolve(true);
            } else {
              // calculation must be only one in collection
              return reject(new DbLayerError('Too many calculations'));
            }
          });
        })
        .catch(err => {
          logger.error('Database layer error', {error: err});
          return reject(new DbLayerError(err));
        });
    });
  }

  static create(calculation: Calculation): Promise<mongodb.ObjectID> {
    return new Promise((resolve, reject) => {

    });
  }

  static remove(attribute: Calculation): Promise<Boolean>;

  static remove(attribute: string): Promise<Boolean>;

  static remove(attribute: mongodb.ObjectID): Promise<Boolean>;

  static remove(attribute): Promise<Boolean> {
    return new Promise((resolve, reject) => {

      if (typeof attribute === "object") {
        // attribute must be Calculation object
      }
      else if (typeof attribute === "string") {
        // attribute must be hash

      } else if (typeof attribute === "mongodb.ObjectID") {
        // attribute must be hash

      } else {
        //
      }
    });
  }

  static update(calculation: Calculation): Promise<Calculation> {
    return new Promise((resolve, reject) => {

    });
  }
}