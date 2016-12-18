import "mocha";
import {assert, expect} from "chai";
import * as sinon from "sinon";
import ClientMessage from "../../models/ClientMessage";
import InputProcessResults from "../../models/InputProcessResults";
import logger from "../../logger/winston";
import processInput from "../../middleware/ProcessInput";

describe('Testing processInput', function () {

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('Test processInput method', function () {
    it('should successfully parse body strings to InputProcessResults object', function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: '3000/r/n2000/r/n1000/r/n1500'
      };
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(0);
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(4);
          done();
        })
        .catch((err)=>{
          done(err);
        })
    });

    it('should return 1 "Client message" "Calculation task is empty!"', sinon.test(function (done) {
      let bodyMock = {
        bars: '',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: '3000/r/n2000/r/n1000/r/n1500'
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Calculation task is empty!');
          expect(result.calculation.bars).to.have.lengthOf(0);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(4);
          sinon.assert.calledTwice(stubLoggerInfo);
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Calculation task is empty!');
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 1 "Client message" "Calculation task is too simple."', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: '3000/r/n2000/r/n1000/r/n1500'
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Calculation task is too simple.');
          expect(result.calculation.bars).to.have.lengthOf(5);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(4);
          sinon.assert.calledTwice(stubLoggerInfo);
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Calculation task is too simple.');
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should parse body strings with minus signs to InputProcessResults object.', sinon.test(function (done) {
      let bodyMock = {
        bars: '-1500/r/n-2000/r/n-600/r/n-500/r/n-300/r/n-1500/r/n2000/r/n-600/r/n500/r/n-300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '-150',
        fullBar: '-6500',
        sawWidth: '-5',
        minAllowWaste: '-300',
        remnants: '-3000/r/n2000/r/n-1000/r/n1500'
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(0);
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(4);
          sinon.assert.calledTwice(stubLoggerInfo);
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should parse body strings to InputProcessResults object with empty remnants.', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(0);
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledTwice(stubLoggerInfo);
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 1 "Client message" about too short bar', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n60/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Bar length 60 is shorter than minimum allowed bar: 150');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledTwice(stubLoggerInfo);
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Bar length 60 is shorter than minimum allowed bar: 150');
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 1 "Client message" about too long bar', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n15500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Bar length 15500 is longer than maximum allowed bar: 6500');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledTwice(stubLoggerInfo);
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Bar length 15500 is longer than maximum allowed bar: 6500');
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 21 "Client messages" 20 about too short all bars and 1 too long minAllowBar', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '15500',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(21);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Min allow bar length 15500 is more than length of full bar 6500');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(15500);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledTwice(stubLoggerInfo);
          sinon.assert.callCount(stubLoggerError, 21);
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 21 "Client messages" 20 about too short all bars and 1 minAllowBar length is more than half of full bar', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '5500',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '300',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(21);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Min allow bar length 5500 is more than half length of full bar 6500');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(5500);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledThrice(stubLoggerInfo);
          sinon.assert.callCount(stubLoggerError, 20);
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 1 "Client message" about too thick sawWidth', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '6555',
        minAllowWaste: '300',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Saw width is too thick (6555 mm)');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(6555);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledTwice(stubLoggerInfo);
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Saw width is too thick (6555 mm)');
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 1 "Client message" about sawWidth looks like too thick', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '10',
        minAllowWaste: '300',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Saw width looks like too thick (10 mm)');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(10);
          expect(result.calculation.minAllowWaste).to.be.equal(300);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledThrice(stubLoggerInfo);
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 1 "Client messages" too long minAllowWaste', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '30000',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      const stubLoggerError = this.stub(logger, 'error');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Min allow waste length 30000 is more than length of full bar 6500');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(30000);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledTwice(stubLoggerInfo);
          sinon.assert.calledOnce(stubLoggerError);
          sinon.assert.calledWith(stubLoggerError, 'Min allow waste length 30000 is more than length of full bar 6500');
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

    it('should return 1 "Client messages" about minAllowWaste length is more than half of full bar', sinon.test(function (done) {
      let bodyMock = {
        bars: '1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n1500/r/n2000/r/n600/r/n500/r/n300/r/n',
        minAllowBar: '150',
        fullBar: '6500',
        sawWidth: '5',
        minAllowWaste: '6000',
        remnants: ''
      };
      const stubLoggerInfo = this.stub(logger, 'info');
      processInput.processInput(bodyMock)
        .then((result) => {
          expect(result).to.not.be.null;
          expect(result).to.be.an.instanceof(InputProcessResults);
          expect(result.messages).to.have.lengthOf(1);
          expect(result.messages[0]).to.be.an.instanceof(ClientMessage);
          expect(result.messages[0].message).to.be.equal('Min allow waste length 6000 is more than half length of full bar 6500');
          expect(result.calculation.bars).to.have.lengthOf(20);
          expect(result.calculation.minAllowBar).to.be.equal(150);
          expect(result.calculation.fullBar).to.be.equal(6500);
          expect(result.calculation.sawWidth).to.be.equal(5);
          expect(result.calculation.minAllowWaste).to.be.equal(6000);
          expect(result.calculation.remnants).to.have.lengthOf(0);
          sinon.assert.calledThrice(stubLoggerInfo);
          done();
        })
        .catch((err)=>{
          done(err);
        })
    }));

  });
});
