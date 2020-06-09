export class Player {
  public name: string;
  public color: string;
  public ready: boolean;

  constructor(name: string, color: string, ready: boolean) {
    this.name = name;
    this.color = color;
    this.ready = ready;
  }
}
