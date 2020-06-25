import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ModalsService } from './modals.service';
import { Room } from './models/room.model';

@Injectable({providedIn: 'root'})
export class NewGameService {
  gameChanged = new Subject<Room[]>();
  roomCode : string;
  game : Room[] = [];
  username : string;
  usernameStored : Subject<string> = new Subject<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalsService: ModalsService,
  ){
    this.username = JSON.parse(localStorage.getItem('username'));
  }

  storeName(username:string) {
    localStorage.setItem('username', JSON.stringify(username));
    this.username = username;
    this.usernameStored.next(username);
  }

  get loggedUser() {
    return this.username
  }

  removeUsername() {
    this.router.navigate(['/']);
    localStorage.removeItem('username');
    this.usernameStored.next('');
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
    if (this.username == null) {
      this.modalsService.open('enterName');
    }
  }

}
