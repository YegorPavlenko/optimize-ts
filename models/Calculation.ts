export default class Calculation {
  bars: Array<number>;
  minAllowBar: number;
  fullBar: number;
  sawWidth: number;
  minAllowWaste: number;
  remnants: Array<number>;
  hash: string;

  normalize() {
    this.bars.sort((a, b) => { return a - b });
    this.remnants.sort((a, b) => { return a - b });
  }

  createHash(): string {
    // TODO create stringify by myself and add hash function
    // TODO check if calculation is good enough to create hash on it
    this.normalize();
    this.hash = JSON.stringify(this);
    return this.hash;
  }
}