import "mocha";
import {assert, expect} from "chai";
import CalculationDataMapper from "../../db_layer/CalculationDataMapper";
import Calculation from "../../models/Calculation";

describe('Testing CalculationDataMapper', function () {
  let testConnectionURL: string;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    testConnectionURL = "mongodb://localhost:27017/optimize_test";
  });

  describe('Test create method', function () {
    it('should check insert Calculation in database collection', function (done) {
      const calculation: Calculation = new Calculation();
      calculation.bars = [200, 200, 200, 200, 200, 200, 200, 200, 200, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2100, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000];
      calculation.minAllowBar = 150;
      calculation.fullBar = 6500;
      calculation.sawWidth = 5;
      calculation.minAllowWaste = 300;
      calculation.remnants =  [1500, 2000, 2500, 3000];

      CalculationDataMapper.create(calculation)
        .then((result) => {
          console.log('result', result);
          console.dir(result);
          console.log('result type', typeof result);
          expect(result).to.not.be.null;
          expect(result).to.be.a('object');
          expect(result).to.contain('id');
          // done();
        })
        .catch((err) => {
          console.log('err', err);
          // assert.fail(err);
          expect(err).to.be.null;
          // done();
        });
    });
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
