import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Player } from './models/player.model';
import { Subject } from 'rxjs';
import { ModalsService } from './modals.service';

interface Game {
  [room: string]: Player[];
}

@Injectable({providedIn: 'root'})
export class NewGameService {
  playersChanged = new Subject<Player[]>();
  roomCode:string;

  private games: Game = {
    '34KL2': [
      new Player('Alexander', 'blue', false, 0, false),
      new Player('', 'green', false, 0, false),
      new Player('Diana', 'red', true, 0, false),
      new Player('', 'yellow', false, 0, false),
      new Player('', 'lightblue', false, 0, false),
      new Player('', 'white', false, 0, false),
      new Player('', 'black', false, 0, false),
      new Player('', 'grey', false, 0, false),
    ]
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalsService: ModalsService,
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

    this.addPlayer(this.roomCode, new Player(player, '', false, 0, false));
  }

  getPlayersPerRoom(room) {
    if (typeof this.games[room] == 'undefined') {
      this.router.navigate(['/room/404']);
    }
    return this.games[room].slice();
  }

  addPlayer(room: string, player: Player) {
    for (let pl in this.games[room]) {
      if (this.games[room][pl]['name'] == '') {
        this.games[room][pl]['name'] = player.name;
        localStorage.setItem('color', JSON.stringify(player.color));
        break;
      }
    }

    this.playersChanged.next(this.games[room].slice());
  }

  checkIfUserLogged() {
    const player = JSON.parse(localStorage.getItem('username'));
    if (player == null) {

    }
    console.log(player);

    //this.modalsService.open('enterName');
  }

}
