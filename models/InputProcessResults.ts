import ClientMessage from "./ClientMessage";
import Calculation from "./Calculation";
export default class InputProcessResults {
  calculation: Calculation;
  messages: Array<ClientMessage>;

  constructor(calculation: Calculation, messages: Array<ClientMessage> = []) {
    this.calculation = calculation;
    this.messages = messages;
  }


}