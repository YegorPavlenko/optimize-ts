import "mocha";
import processInput from "../../middleware/ProcessInput";

describe('Testing processInput', function () {

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('Test processInput method', function () {
    it('should parsing body strings to Input objects', function () {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: '3000/r/n2000/r/n1000/r/n1500'
      };
      processInput.processInput(bodyMock);
    });
  });
});
