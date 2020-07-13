import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { ModalsService } from './modals.service';
import { Room } from './models/room.model';
import { Player } from './models/player.model';

@Injectable({providedIn: 'root'})
export class NewGameService {
  gameChanged = new BehaviorSubject<any>(null);
  roomCode : string;
  game : Room[] = [];
  username : string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalsService: ModalsService,
  ){
    this.username = JSON.parse(localStorage.getItem('username'));
  }

  storeName(username:string) {
    localStorage.setItem('username', JSON.stringify(username));
    localStorage.setItem('uid', JSON.stringify(Date.now()));

    this.username = username;
  }

  get loggedUser() {
    return this.username
  }

  removeUsername() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  hostNewGame() {
    this.roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    return this.roomCode;
  }

  setPlayersPerRoom(room:Room[]) {
    this.game = room;
    this.gameChanged.next(this.game.slice());
  }

  getPlayersPerRoom() {
    return this.game.slice();
  }

  checkIfUserLogged() {
    if (JSON.parse(localStorage.getItem('username')) == null) {
      this.modalsService.open('enterName');
    }
  }

  resetPlayerFields(player:Player) {
    player.name = '';
    player.points = 0;
    player.ready = false;
    player.storyteller = false;
    player.uid = 0;
    player.host = false;

    return player;
  }

  winner(data) {
    if (data !== undefined) {
      const winners = data.players
                          .filter(players => { return players.points >= 30 })
                          .sort(function(a, b) { return b.points - a.points; });
      let winner = {};
      if (Object.keys(winners).length == 1) {
        winner = winners[0];
      } else {
        if (winners[0] > winners[1]) {
          winner = winners[0];
        }
      }

      return winner;
    }

    return {};
  }

}
