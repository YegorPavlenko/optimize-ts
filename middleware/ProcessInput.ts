/*
 Проверяем входные данные:
 Количество размеров, которые нужно нарезать не менее 20?
 Все числа положительные целые;
 Остатков (remnants) может не быть.
 */

import Calculation from "../models/Calculation";
import config from "../config/config";
import {Input} from "../models/Input";
import logger from "../logger/winston";
import ProcessInputResults from "../models/InputProcessResults";
import ClientMessage from "../models/ClientMessage";

//TODO messages into variables and into config

export default class ProcessInput {
  static minTaskComplexity = config.get('task:minComplexity');
  static sawWidthWarningThreshold = config.get('task:sawWidthWarningThreshold');

  static processInput(requestBody: Input): Promise<ProcessInputResults> {
    return new Promise((resolve, reject) => {
      const regExForExtractNumbers = /\d+/g;
      const calculation = new Calculation();
      const processInputResults = new ProcessInputResults(calculation);
      let inputBars: Array<string>;
      let bars: Array<number> = [];
      let minAllowBar: number;
      let fullBar: number;
      let sawWidth: number;
      let minAllowWaste: number;
      let inputRemnants: Array<string>;
      let remnants: Array<number> = [];

      logger.info("requestBody", requestBody);

      // TODO check if body or some body property too big

      inputBars = requestBody.bars.match(regExForExtractNumbers);
      if (!inputBars) {
        logger.error('Calculation task is empty!');
        processInputResults.messages.push(new ClientMessage('Calculation task is empty!'));
      }
      // check if count bars to cut too small
      if (inputBars && inputBars.length < ProcessInput.minTaskComplexity) {
        logger.error('Calculation task is too simple.');
        processInputResults.messages.push(new ClientMessage('Calculation task is too simple.'));
      }
      if (inputBars) {
        inputBars.forEach((value, index, array) => bars[index] = parseInt(value));
      }

      fullBar = Math.abs(parseInt(requestBody.fullBar));

      minAllowBar = Math.abs(parseInt(requestBody.minAllowBar));

      if (minAllowBar > fullBar) {
        logger.error(`Min allow bar length ${minAllowBar} is more than length of full bar ${fullBar}`);
        processInputResults.messages.push(new ClientMessage(`Min allow bar length ${minAllowBar} is more than length of full bar ${fullBar}`));
      } else if (minAllowBar > fullBar/2) {
        logger.info(`Min allow bar length ${minAllowBar} is more than half length of full bar ${fullBar}`);
        processInputResults.messages.push(new ClientMessage(`Min allow bar length ${minAllowBar} is more than half length of full bar ${fullBar}`));
      }

      sawWidth = Math.abs(parseInt(requestBody.sawWidth));
      if (sawWidth > fullBar) {
        logger.error(`Saw width is too thick (${sawWidth} mm)`);
        processInputResults.messages.push(new ClientMessage(`Saw width is too thick (${sawWidth} mm)`));
      } else if (sawWidth > ProcessInput.sawWidthWarningThreshold) {
        logger.info(`Saw width looks like too thick (${sawWidth} mm)`);
        processInputResults.messages.push(new ClientMessage(`Saw width looks like too thick (${sawWidth} mm)`));
      }

      minAllowWaste = Math.abs(parseInt(requestBody.minAllowWaste));

      if (minAllowWaste > fullBar) {
        logger.error(`Min allow waste length ${minAllowWaste} is more than length of full bar ${fullBar}`);
        processInputResults.messages.push(new ClientMessage(`Min allow waste length ${minAllowWaste} is more than length of full bar ${fullBar}`));
      } else if (minAllowWaste > fullBar/2) {
        logger.info(`Min allow waste length ${minAllowWaste} is more than half length of full bar ${fullBar}`);
        processInputResults.messages.push(new ClientMessage(`Min allow waste length ${minAllowWaste} is more than half length of full bar ${fullBar}`));
      }
      inputRemnants = requestBody.remnants.match(/\d+/g);
      if (inputRemnants) {
        inputRemnants.forEach((value, index, array) => remnants[index] = parseInt(value));
      }

      // check bars with minAllowBar, fullBar and max remnant length
      const maxBar = Math.max(fullBar, ...remnants);
      bars.forEach((curValue) => {
        if (curValue < minAllowBar) {
          logger.error(`Bar length ${curValue} is shorter than minimum allowed bar: ${minAllowBar}`);
          processInputResults.messages.push(new ClientMessage(`Bar length ${curValue} is shorter than minimum allowed bar: ${minAllowBar}`));
        }

      });
      bars.forEach((curValue) => {
        if (curValue > maxBar) {
          logger.error(`Bar length ${curValue} is longer than maximum allowed bar: ${maxBar}`);
          processInputResults.messages.push(new ClientMessage(`Bar length ${curValue} is longer than maximum allowed bar: ${maxBar}`));
        }
      });

      // logger.info('bars', {bars: bars});
      // logger.info('minAllowBar', {minAllowBar: minAllowBar});
      // logger.info('fullBar', {fullBar: fullBar});
      // logger.info('sawWidth', {sawWidth: sawWidth});
      // logger.info('minAllowWaste', {minAllowWaste: minAllowWaste});
      // logger.info('remnants', {remnants: remnants});

      calculation.bars = bars;
      calculation.fullBar = fullBar;
      calculation.minAllowBar = minAllowBar;
      calculation.sawWidth = sawWidth;
      calculation.minAllowWaste = minAllowWaste;
      calculation.remnants = remnants;

      logger.info('inputCalculationData', {calculation: calculation});
      resolve(processInputResults);
    });
  }

  // static validateBars(bars: Calculation): Calculation {
  //   return
  //
  // }
}