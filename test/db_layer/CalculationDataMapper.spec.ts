import "mocha";
import {assert, expect} from "chai";
import CalculationDataMapper from "../../db_layer/CalculationDataMapper";
import Calculation from "../../models/Calculation";
import config from "../../config/config";
import * as mongodb from "mongodb";
import logger from "../../logger/winston";
import * as sinon from "sinon";
import Database from "../../db_layer/Database";

describe('Testing CalculationDataMapper', function () {
  let testConnectionURL: string;

  beforeEach(function() {
    process.env.NODE_ENV = 'test';
    testConnectionURL = "mongodb://localhost:27017/optimize_test";

    // Drop "Calculation" collection
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(testConnectionURL, function(err: mongodb.MongoError, db: mongodb.Db) {

      let collection = db.collection(CalculationDataMapper.CALCULATIONS_COLLECTION_NAME);

      collection.drop(function(err, reply) {

        // Ensure we don't have the collection in the set of names
        db.listCollections().toArray(function(err, replies) {

          let found = false;
          // For each collection in the list of collection names in this db look for the
          // dropped collection
          replies.forEach(function(document) {
            if(document.name === CalculationDataMapper.CALCULATIONS_COLLECTION_NAME) {
              found = true;
              return;
            }
          });

          // Ensure the collection is not found
          expect(found).to.be.equal(false);

          db.close();
        });
      });
    });
  });

  describe('Test create method', function () {
    it('should check insert Calculation in database collection', function (done) {
      const calculation: Calculation = new Calculation();
      calculation.bars = [200, 200, 200, 200, 200, 200, 200, 200, 200, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000];
      calculation.minAllowBar = 150;
      calculation.fullBar = 6500;
      calculation.sawWidth = 5;
      calculation.minAllowWaste = 300;
      calculation.remnants = [1500, 2000, 2500, 3000];

      Database.connect()
        .then(() => {
          CalculationDataMapper.create(calculation)
            .then((result) => {
              expect(result).to.not.be.null;
              expect(result).to.be.instanceof(mongodb.ObjectID);
              Database.close()
                .then(() => {
                  done();
                })
                .catch((err) => {
                  done(err);
                });
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('Test checkExistence method', function () {
    it('should check if Calculation exist in database by given empty hash', sinon.test(function (done) {
      const testHash: string = "";
      const stubLoggerError = this.stub(logger, 'error');
      Database.connect()
        .then(() => {
          CalculationDataMapper.checkExistence(testHash)
            .then((result) => {
              assert.fail(result);
              Database.close()
                .then(() => {
                  done();
                })
                .catch((err) => {
                  done(err);
                });
            })
            .catch((err) => {
              expect(err).to.equal('Empty parameter "hash"');
              sinon.assert.calledOnce(stubLoggerError);
              sinon.assert.calledWith(stubLoggerError, 'Empty parameter "hash"');
              Database.close()
                .then(() => {
                  done();
                })
                .catch((err) => {
                  done(err);
                });
            });
        })
        .catch((err) => {
          done(err);
        });
    }));
  });

  describe('Test checkExistence method', function () {
    it('should check if Calculation exist in database by given hash', function (done) {
      const calculation: Calculation = new Calculation();
      calculation.bars = [200, 200, 200, 200, 200, 200, 200, 200, 200, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000];
      calculation.minAllowBar = 150;
      calculation.fullBar = 6500;
      calculation.sawWidth = 5;
      calculation.minAllowWaste = 300;
      calculation.remnants = [1500, 2000, 2500, 3000];
      const testHash = calculation.createHash();

      Database.connect()
        .then(() => {
          CalculationDataMapper.create(calculation)
            .then((createResult) => {
              expect(createResult).to.not.be.null;
              expect(createResult).to.be.instanceof(mongodb.ObjectID);
              CalculationDataMapper.checkExistence(testHash)
                .then((checkResult) => {
                  console.log('check result', checkResult);
                  console.log('test hash', testHash);
                  console.log('calculation', calculation);
                  console.log('create result', createResult);
                  assert.isBoolean(checkResult);
                  expect(checkResult).to.equal(true);
                  Database.close()
                    .then(() => {
                      done();
                    })
                    .catch((err) => {
                      done(err);
                    });
                })
                .catch((err) => {
                  done(err);
                });
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('Test getClassName method', function () {
    it('it should return class name "CalculationDataMapper"', function () {
      expect(CalculationDataMapper.getClassName()).to.equal('CalculationDataMapper');
    })
  });
});
