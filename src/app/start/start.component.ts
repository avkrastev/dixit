import { Component, OnInit } from '@angular/core';
import { NewGameService } from '../new-game.service';
import { ModalsService } from '../modals.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  username:string;
  usernameBtnDisabled = true;
  modal:string;

  constructor(
    private modalsService: ModalsService,
    private newGameService: NewGameService,
  ) {}

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('username'));
  }

  newGame() {
    if (!this.username) {
      this.modalsService.open('enterName');
    } else {
      this.newGameService.hostNewGame();
    }
  }

  join() {
    const modal = !this.username ? 'enterName' : 'enterRoom';
    this.modalsService.open(modal);
  }


}
