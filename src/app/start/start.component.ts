import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewGameService } from '../new-game.service';
import { ModalsService } from '../modals.service';
import { DataStorageService } from '../data-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, OnDestroy {
  username : string;
  usernameBtnDisabled = true;
  modal : string;
  subscription : Subscription;

  constructor(
    private modalsService: ModalsService,
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription = this.newGameService.usernameStored.subscribe((username : string) => {
      this.username = username;
    });

    this.username = JSON.parse(localStorage.getItem('username'));
  }

  newGame() {
    if (!this.username) {
      this.modalsService.open('enterName');
    } else {
      const roomCode = this.newGameService.hostNewGame();
      this.dataStorage.createNewRoom(roomCode)
        .then(() => {
          this.router.navigate(['room', roomCode], { relativeTo: this.route });
        })
        .catch(function(error) {
          console.error("Error adding players to new room: ", error);
        });
    }
  }

  join() {
    const modal = !this.username ? 'enterName' : 'enterRoom';
    this.modalsService.open(modal);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
