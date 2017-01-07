import "mocha";
import {assert, expect} from "chai";
import InputProcessResults from "../../models/InputProcessResults";
import Calculation from "../../models/Calculation";

describe('Testing InputProcessResults model', function () {

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('Test InputProcessResults constructor', function () {
    it('should successfully create InputProcessResults object', function () {
      const testInputProcessResult = {calculation:{},messages:[]};
      const calculation = new Calculation();
      const inputProcessResults = new InputProcessResults(calculation);
      expect(calculation).to.not.be.null;
      expect(inputProcessResults).to.not.be.null;
      expect(calculation).to.be.an.instanceof(Calculation);
      expect(inputProcessResults).to.be.an.instanceof(InputProcessResults);
      expect(inputProcessResults.messages).to.have.lengthOf(0);
      expect(JSON.stringify(inputProcessResults)).to.equal(JSON.stringify(testInputProcessResult));
    });
  });
});
