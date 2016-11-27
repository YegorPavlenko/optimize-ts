import Calculation from "../models/Calculation";
import ProcessCalculationResults from "../models/CalculationProcessResults";
import logger from "../logger/winston";
import CalculationDataMapper from "../db_layer/CalculationDataMapper";



export default class ProcessCalculation {
  static processCalculation(calculation: Calculation): Promise<ProcessCalculationResults> {
    return new Promise((resolve, reject) => {
      const processCalculationResults = new ProcessCalculationResults(calculation);
      let curCalculationHash: string;

      // TODO make calculation "hash"
      curCalculationHash = calculation.createHash();
      logger.info('curCalculationHash', {curCalculationHash: curCalculationHash});

      // TODO search calculation in database by "hash" if it exists - increase counter and if solution exists - answer with solution
      CalculationDataMapper.checkExistence(curCalculationHash)
        .then(exist => {
          if (exist) {
            logger.info('Calculation already exists');
          } else {
            logger.info('Calculation does not exist')
          }
        })
        .catch(err => {
          logger.info('While check Calculation existence was error');
        });
      // TODO if solution not exists check if calculation exists in queue then answer ...
      // TODO if solution not exists and not exists in queue - set calculation in queue

      resolve(processCalculationResults);
    })
  }
}