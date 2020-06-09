import { Player } from './player.model';

export class Recipe {
  public room: string;
  public players: Player[];
  public points: [];
  public turn: string;


  constructor(room: string, players: Player[], points: [], turn: string) {
    this.room = room;
    this.players = players;
    this.points = points;
    this.turn = turn;
  }
}
