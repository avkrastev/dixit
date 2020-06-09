import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Player } from './models/player.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NewGameService {
  playersChanged = new Subject<Player[]>();
  roomCode:string;

  private players: Player[] = [
    new Player('Alexander', 'blue', false),
    new Player('', 'green', false),
    new Player('Diana', 'red', true),
    new Player('', 'yellow', false),
    new Player('', 'lightblue', false),
    new Player('', 'white', false),
    new Player('', 'black', false),
    new Player('', 'grey', false),
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  storeName(username) {
    localStorage.setItem('username', JSON.stringify(username));
  }

  removeUsername() {
    this.router.navigate(['/']);
    localStorage.removeItem('username');
  }

  hostNewGame() {
    this.roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.router.navigate(['room', this.roomCode], { relativeTo: this.route });

    const player = JSON.parse(localStorage.getItem('username'));
    this.addPlayer(new Player(player, '', false));
  }

  getPlayers() {
    return this.players.slice();
  }

  addPlayer(player: Player) {
    for (let pl in this.players) {
      if (this.players[pl]['name'] == '') {
        this.players[pl]['name'] = player.name;
        break;
      }
    }

    this.playersChanged.next(this.players.slice());
  }

}
