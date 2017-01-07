import * as mongodb from "mongodb";
import config from "../config/config";
import logger from "../logger/winston";
import DbLayerError from "../Error/DbLayerError";
import Database from "./Database";
import Calculation from "../models/Calculation";

export default class CalculationDataMapper {

  static CALCULATIONS_COLLECTION_NAME: string = 'calculations';

  static getClassName() {
    return 'CalculationDataMapper';
  }

  static findByHash(hash: string): Promise<Array<Object>> {
    return new Promise((resolve, reject) => {
      if (!hash) {
        logger.error('Empty parameter "hash"', {
          className: CalculationDataMapper.getClassName(),
          methodName: "findByHash"
        });
        return reject('Empty parameter "hash"');
      }
      Database.get()
        .then(db => {
          let collection: mongodb.Collection = db.collection(CalculationDataMapper.CALCULATIONS_COLLECTION_NAME);
          if (!collection) {
            throw (new DbLayerError('No collection!'));
          }
          collection.find({'hash': hash}).toArray((err: mongodb.MongoError, docs: Array<Object>) => {
            if (err) {
              logger.error(`Collection ${collection.collectionName} find error!`, {error: err});
              return reject(new DbLayerError(err));
            }
            logger.info("Found the following records: ", docs);

            if (docs.length === 0) {
              return resolve(docs);
            } else if (docs.length === 1) {
              return resolve(docs);
            } else if (docs.length > 1) {
              // calculation must be only one in collection
              return reject(new DbLayerError('Too many calculations'));
            } else {
              return reject(new DbLayerError('Unknown find calculation error'));
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
      Database.get()
        .then(db => {
          let collection: mongodb.Collection = db.collection(CalculationDataMapper.CALCULATIONS_COLLECTION_NAME);
          if (!collection) {
            throw (new DbLayerError('No collection!'));
          }
          collection.insertOne(calculation, (err: mongodb.MongoError, result: mongodb.InsertOneWriteOpResult) => {
            if (err) {
              logger.error(`Collection ${collection.collectionName} find error!`, {error: err});
              return reject(new DbLayerError(err));
            }
            logger.info("Inserted the following calculation", {calculation: calculation, insertResult: result});

            if (result.insertedCount === 1) {
              return resolve(result.insertedId);
            } else if (result.insertedCount === 0) {
              return resolve(null);
            } else {
              // calculation must be only one in collection
              return reject(new DbLayerError('Too many insert in calculations'));
            }
          });
        })
        .catch(err => {
          logger.error('Database layer error', {error: err});
          return reject(new DbLayerError(err));
        });
    });
  }

  static checkExistence(hash: string): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      CalculationDataMapper.findByHash(hash)
        .then(docs => {
            if (docs.length === 0) {
              return resolve(false);
            } else if (docs.length === 1) {
              return resolve(true);
            } else {
              // calculation must be only one in collection
              return reject(new DbLayerError('Too many calculations'));
            }
          }
        )
        .catch(err => {
          return reject(err);
        });
    });
  }

  static increaseCounter(hash: string): Promise<number> {
    return new Promise((resolve, reject) => {
      CalculationDataMapper.findByHash(hash)
        .then(docs => {

        })
        .catch(err => {

        });
    });
  }

  // static remove(attribute: Calculation): Promise<Boolean>;
  //
  // static remove(attribute: string): Promise<Boolean>;
  //
  // static remove(attribute: mongodb.ObjectID): Promise<Boolean>;
  //
  // static remove(attribute): Promise<Boolean> {
  //   return new Promise((resolve, reject) => {
  //     console.log('attribute type: ', typeof attribute);
  //     if (typeof attribute === "object") {
  //       // attribute must be Calculation object
  //     }
  //     else if (typeof attribute === "string") {
  //       // attribute must be hash
  //
  //     } else if (typeof attribute === "mongodb.ObjectID") {
  //       // attribute must be hash
  //
  //     } else {
  //       //
  //     }
  //   });
  // }
  //
  // static update(calculation: Calculation): Promise<Calculation> {
  //   return new Promise((resolve, reject) => {
  //
  //   });
  // }
}