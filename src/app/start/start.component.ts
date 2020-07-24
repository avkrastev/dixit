import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../modals.service';
import { DataStorageService } from '../data-storage.service';
import { Subscription } from 'rxjs';
import { NewGameService } from '../new-game.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  username : string;
  usernameBtnDisabled = true;
  modal : string;
  subscription : Subscription;

  constructor(
    private modalsService: ModalsService,
    private dataStorage: DataStorageService,
    private newGameService: NewGameService
  ) {}

  ngOnInit(): void {
    this.modalsService.close();
    const logout = window.history.state.logout;
    const playerToRemove = window.history.state.playerToRemove;

    if (playerToRemove !== undefined) {
      if (logout) {
        this.newGameService.removeUsername();
      }
      const roomData = window.history.state.roomData;
      this.dataStorage.removePlayerFromRoom(playerToRemove, roomData, logout);
    }
    this.username = JSON.parse(localStorage.getItem('username'));

    this.dataStorage.deleteOldRooms();
  }

  newGame() {
    if (!JSON.parse(localStorage.getItem('username'))) {
      this.modalsService.open('enterName');
    } else {
      this.dataStorage.newGame();
    }
  }

  join() {
    const modal = !this.username ? 'enterName' : 'enterRoom';
    this.modalsService.hostOrJoin.next('join');
    this.modalsService.open(modal);
  }

  howToPlay() {
    this.modalsService.open('rules');
  }

}
