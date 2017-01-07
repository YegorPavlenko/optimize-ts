import "mocha";
import {assert, expect} from "chai";
import config from "../../config/config";
import * as mongodb from "mongodb";
import logger from "../../logger/winston";
import * as sinon from "sinon";
import Database from "../../db_layer/Database";
import DbLayerError from "../../Error/DbLayerError";

describe('Testing Database class', function () {

  beforeEach(function () {
    process.env.NODE_ENV = 'test';
  });

  describe('Test "connect" method', function () {
    it('should make database connection', sinon.test(function (done) {
      const testConnectionURL = config.get('mongodb:url');
      const stubLoggerInfo = this.stub(logger, 'info');
      Database.connect(testConnectionURL)
        .then(() => {
          sinon.assert.calledOnce(stubLoggerInfo);
          Database.close().then(() => {
            done()
          });
        })
        .catch((err) => {
          done(err);
        });
    }));

    it('should return database connection despite empty connection string parameter', sinon.test(function (done) {
      const stubLoggerInfo = this.stub(logger, 'info');
      Database.connect()
        .then(() => {
          sinon.assert.calledOnce(stubLoggerInfo);
          Database.close().then(() => {
            done()
          });
        })
        .catch((err) => {
          done(err);
        });
    }));

    it('should fail database connection', sinon.test(function (done) {
      const wrongConnectionURL = 'wrong';
      const stubLoggerError = this.stub(logger, 'error');
      Database.connect(wrongConnectionURL)
        .then((result) => {
          assert.fail(result);
          done();
        })
        .catch((err) => {
          expect(err).to.not.be.null;
          expect(err).to.be.instanceof(Error);
          done();
        });
    }));

    it('should fail database connection with wrong port', sinon.test(function (done) {
      const wrongConnectionURL = 'mongodb://localhost:33/optimize_test';
      const stubLoggerError = this.stub(logger, 'error');
      Database.connect(wrongConnectionURL)
        .then((result) => {
          assert.fail(result);
          done();
        })
        .catch((err) => {
          expect(err).to.not.be.null;
          expect(err).to.be.instanceof(DbLayerError);
          expect(err.message).to.equal('MongoError: failed to connect to server [localhost:33] on first connect');
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Database connection error!');
          done();
        });
    }));

    it('should fail database connection with wrong config', sinon.test(function (done) {
      const stubLoggerError = this.stub(logger, 'error');
      const wrongConfig = this.stub(config, 'get');
      Database.connect()
        .then((result) => {
          assert.fail(result);
          done();
        })
        .catch((err) => {
          expect(err).to.not.be.null;
          expect(err).to.be.instanceof(DbLayerError);
          expect(err.message).to.equal('Empty database connection string');
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Empty database connection string');
          sinon.assert.calledOnce(wrongConfig);
          sinon.assert.calledWith(wrongConfig, 'mongodb:url');
          done();
        });
    }));
  });

  describe('Test "close" method', function () {
    it('should close database connection', sinon.test(function (done) {
      const testConnectionURL = config.get('mongodb:url');
      const stubLoggerInfo = this.stub(logger, 'info');
      Database.connect(testConnectionURL)
        .then(() => {
          // expect(db).to.not.be.null;
          // expect(db).to.be.instanceof(mongodb.Db);
          // expect(db.databaseName).to.equal('optimize_test');
          sinon.assert.calledOnce(stubLoggerInfo);
          Database.close()
            .then(result => {
              done();
            })
            .catch(err => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    }));
  });

  describe('Test "get" method after connect', function () {
    it('should return database connection', sinon.test(function (done) {
      const testConnectionURL = config.get('mongodb:url');
      const stubLoggerInfo = this.stub(logger, 'info');
      Database.connect(testConnectionURL)
        .then(() => {
          sinon.assert.calledOnce(stubLoggerInfo);
          Database.get(testConnectionURL)
            .then((db) => {
              expect(db).to.not.be.null;
              expect(db).to.be.instanceof(mongodb.Db);
              expect(db.databaseName).to.equal('optimize_test');
              sinon.assert.calledOnce(stubLoggerInfo);
              Database.close().then(() => {
                done()
              });
            })
            .catch((err) => {
              Database.close();
              done(err);
            });

        })
        .catch((err) => {
          done(err);
        });
    }));
  });

  describe('Test "get" method', function () {
    it('should return database connection', sinon.test(function (done) {
      Database.get()
        .then((db) => {
          expect(db).to.not.be.null;
          expect(db).to.be.instanceof(mongodb.Db);
          expect(db.databaseName).to.equal('optimize_test');
          Database.close().then(() => {
            done()
          });
        })
        .catch((err) => {
          done(err);
        });
    }));
  });

  describe('Test double call "connect" method', function () {
    it('should make database connection', sinon.test(function (done) {
      const testConnectionURL = config.get('mongodb:url');
      const stubLoggerInfo = this.stub(logger, 'info');
      let db1: mongodb.Db;
      let db2: mongodb.Db;
      Database.connect(testConnectionURL)
        .then(() => {
          sinon.assert.calledOnce(stubLoggerInfo);
          Database.get()
            .then((db) => {
              expect(db).to.not.be.null;
              expect(db).to.be.instanceof(mongodb.Db);
              expect(db.databaseName).to.equal('optimize_test');
              db1 = db;
              Database.connect(testConnectionURL)
                .then(() => {
                  sinon.assert.calledOnce(stubLoggerInfo);
                  Database.get()
                    .then((db) => {
                      expect(db).to.not.be.null;
                      expect(db).to.be.instanceof(mongodb.Db);
                      expect(db.databaseName).to.equal('optimize_test');
                      db2 = db;
                      expect(db1).to.equal(db2);
                      Database.close().then(() => {
                        done()
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
        })
        .catch((err) => {
          done(err);
        });
    }));
  });

});
