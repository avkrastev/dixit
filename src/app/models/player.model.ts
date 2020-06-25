export class Player {
  public name: string;
  public color: string;
  public ready: boolean;
  public points: number;
  public storyteller: boolean;
  public key: string;

  constructor(name: string, color: string, ready: boolean, points: number, storyteller: boolean, key:string) {
    this.name = name;
    this.color = color;
    this.ready = ready;
    this.points = points;
    this.storyteller = storyteller;
    this.key = key;
  }
}
