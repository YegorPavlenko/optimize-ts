import * as express from "express";
import ProcessInput from "../middleware/ProcessInput";
import ProcessCalculationResults from "../models/CalculationProcessResults";
import ProcessCalculation from "../middleware/ProcessCalculation";

let router = express.Router();

/* GET home page. */
router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.render('index.html', {title: 'Optimize'});
});

router.post('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  ProcessInput.processInput(req.body)
    .then(
      inputProcessResults => {
        if(inputProcessResults.messages.length > 0) {
          //TODO send messages to client side
        } else {
          ProcessCalculation.processCalculation(inputProcessResults.calculation);
        }
        // console.log('inputProcessResults stringify', JSON.stringify(inputProcessResults.calculation));
        // console.log('inputProcessResults', inputProcessResults)
      })
    .catch(error => console.log('error', error));
  // console.log(req.body);
  res.redirect(303, 'back');
  // res.send('Got a POST request');
});

export = router;