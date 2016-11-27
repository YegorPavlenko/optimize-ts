/*
 Проверяем входные данные:
 Количество размеров, которые нужно нарезать не менее 20?
 Все числа положительные целые;
 Остатков (remnants) может не быть.
 */

import Calculation from "../models/Calculation";
import {Input} from "../models/Input";
import logger from "../logger/winston";
import ProcessInputResults from "../models/InputProcessResults";
import ClientMessage from "../models/ClientMessage";

// export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
//   console.log("req.body", req.body);
//   next();
// }

// TODO all configuration in config
const minTaskComplexity = 3;
const sawWidthWarningThreshold = 9;

//TODO messages into variables and into config

export default class ProcessInput {
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
      // check if count bars to cut too small
      if (inputBars.length < minTaskComplexity) {
        logger.error('Calculation task is too simple.');
        processInputResults.messages.push(new ClientMessage('Calculation task is too simple.'));
      }
      inputBars.forEach((value, index, array) => bars[index] = parseInt(value));

      minAllowBar = parseInt(requestBody.minAllowBar);

      fullBar = parseInt(requestBody.fullBar);

      sawWidth = parseInt(requestBody.sawWidth);
      if (sawWidth > sawWidthWarningThreshold) {
        logger.error('Saw width is too thick');
        processInputResults.messages.push(new ClientMessage('Saw width is too thick'));
      }

      minAllowWaste = parseInt(requestBody.minAllowWaste);

      inputRemnants = requestBody.remnants.match(/\d+/g);
      inputRemnants.forEach((value, index, array) => remnants[index] = parseInt(value));

      // check bars with minAllowBar, fullBar and max remnant length
      const minBarToCut = Math.min(...bars);
      const maxBarToCut = Math.max(...bars);
      const maxBar = Math.max(fullBar, ...remnants);
      if (minBarToCut < minAllowBar) {
        logger.error(`Bar length ${minBarToCut} is shorter than minimum allowed bar: ${minAllowBar}`);
        processInputResults.messages.push(new ClientMessage(`Bar length ${minBarToCut} is shorter than minimum allowed bar: ${minAllowBar}`));
      }
      if (maxBarToCut > maxBar) {
        logger.error(`Bar length ${maxBarToCut} is longer than maximum allowed bar: ${maxBar}`);
        processInputResults.messages.push(new ClientMessage(`Bar length ${maxBarToCut} is longer than maximum allowed bar: ${maxBar}`));
      }

      logger.info('bars', {bars: bars});
      logger.info('minAllowBar', {minAllowBar: minAllowBar});
      logger.info('fullBar', {fullBar: fullBar});
      logger.info('sawWidth', {sawWidth: sawWidth});
      logger.info('minAllowWaste', {minAllowWaste: minAllowWaste});
      logger.info('remnants', {remnants: remnants});

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

  static validateBars(bars: Calculation): Calculation {
    return

  }
}