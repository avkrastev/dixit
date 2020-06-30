export class Player {
  public name: string;
  public color: string;
  public ready: boolean;
  public points: number;
  public storyteller: boolean;
  public uid: number;

  constructor(name: string, color: string, ready: boolean, points: number, storyteller: boolean, uid:number) {
    this.name = name;
    this.color = color;
    this.ready = ready;
    this.points = points;
    this.storyteller = storyteller;
    this.uid = uid;
  }
}
