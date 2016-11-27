import "mocha";
import {expect} from "chai";
import CalculationDataMapper from "../../db_layer/CalculationDataMapper";

describe('Testing CalculationDataMapper', function () {
  let testConnectionURL: string;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    testConnectionURL = "mongodb://localhost:27017/optimize_test";
  });

  describe('Test checkExistence method', function () {
    it('should check if Calculation exist in database by given empty hash', function (done) {
      const testHash: string = "";
      CalculationDataMapper.checkExistence(testHash)
        .then((result) => {
          assert.fail(result);
          done();
        })
        .catch((err) => {
          expect(err).to.equal('Empty parameter "hash"');
          done();
        });
    });
  });

  // describe('Test checkExistence method', function () {
  //
  //   before(() => {
  //
  //   });
  //
  //   it('should check if Calculation exist in database by given empty hash', function (done) {
  //     const testHash: string = "";
  //     CalculationDataMapper.checkExistence(testHash)
  //       .then((result) => {
  //         assert.fail(result);
  //         done();
  //       })
  //       .catch((err) => {
  //         expect(err).to.equal('Empty parameter "hash"');
  //         done();
  //       });
  //   });
  // });
});
