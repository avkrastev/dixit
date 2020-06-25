import { Player } from './player.model';

export class Room {
  public key: string;
  public players: Player[];

  constructor(key: string, players: Player[]) {
    this.key = key;
    this.players = players;
  }
}
