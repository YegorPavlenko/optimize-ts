export default class Calculation {
  bars: Array<number>;
  minAllowBar: number;
  fullBar: number;
  sawWidth: number;
  minAllowWaste: number;
  remnants: Array<number>;
  hash: string;
  counter: number;

  constructor () {
    this.counter = 0;
  }

  normalize() {
    this.bars.sort((a, b) => { return a - b });
    this.remnants.sort((a, b) => { return a - b });
  }

  createHash(): string {
    // TODO MUST TO BE REPLACED BY HASH FUNCTION!!!
    // TODO check if calculation is good enough to create hash on it
    this.normalize();
    this.hash = JSON.stringify(this);
    return this.hash;
  }
}