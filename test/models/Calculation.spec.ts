import "mocha";
import {assert, expect} from "chai";
import InputProcessResults from "../../models/InputProcessResults";
import Calculation from "../../models/Calculation";

describe('Testing Calculation model', function () {

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('Test Calculation constructor', function () {
    it('should successfully create Calculation object', function () {
      const calculation = new Calculation();
      expect(calculation).to.not.be.null;
      expect(calculation).to.be.an.instanceof(Calculation);
    });
  });

  describe('Test Calculation normalize method', function () {
    it('should successfully sort "bars" and "remnants" members Calculation object', function () {
      const bars = [1500,2000,600,500,300,1500,2000,600,500,300,1500,2000,600,500,300,1500,2000,600,500,300];
      const sortedBars = [300,300,300,300,500,500,500,500,600,600,600,600,1500,1500,1500,1500,2000,2000,2000,2000];
      const remnants = [3000,2000,1000,1500];
      const sortedRemnants = [1000,1500,2000,3000];
      const testCalculation = new Calculation();
      testCalculation.bars = sortedBars;
      testCalculation.remnants = sortedRemnants;
      const calculation = new Calculation();
      calculation.bars = bars;
      calculation.remnants = remnants;
      calculation.normalize();
      expect(calculation).to.not.be.null;
      expect(calculation).to.be.an.instanceof(Calculation);
      expect(JSON.stringify(calculation)).to.equal(JSON.stringify(testCalculation));
    });
  });

  describe('Test Calculation createHash method', function () {
    it('should successfully sort "bars" and "remnants" members Calculation object', function () {
      const bars = [1500,2000,600,500,300,1500,2000,600,500,300,1500,2000,600,500,300,1500,2000,600,500,300];
      const remnants = [3000,2000,1000,1500];
      const minAllowBar = 150;
      const fullBar = 6500;
      const sawWidth =  5;
      const minAllowWaste = 300;
      const testCalculation = {
        bars: [300,300,300,300,500,500,500,500,600,600,600,600,1500,1500,1500,1500,2000,2000,2000,2000],
        minAllowBar: 150,
        fullBar: 6500,
        sawWidth: 5,
        minAllowWaste: 300,
        remnants: [1000,1500,2000,3000],
        hash: "{\"bars\":[300,300,300,300,500,500,500,500,600,600,600,600,1500,1500,1500,1500,2000,2000,2000,2000],\"minAllowBar\":150,\"fullBar\":6500,\"sawWidth\":5,\"minAllowWaste\":300,\"remnants\":[1000,1500,2000,3000]}"
      };
      const calculation = new Calculation();
      calculation.bars = bars;
      calculation.minAllowBar = minAllowBar;
      calculation.fullBar = fullBar;
      calculation.sawWidth = sawWidth;
      calculation.minAllowWaste = minAllowWaste;
      calculation.remnants = remnants;
      calculation.createHash();
      expect(calculation).to.not.be.null;
      expect(calculation).to.be.an.instanceof(Calculation);
      expect(JSON.stringify(calculation)).to.equal(JSON.stringify(testCalculation));
    });
  });

});
