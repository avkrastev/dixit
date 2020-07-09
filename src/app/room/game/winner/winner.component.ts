import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';
import { NewGameService } from 'src/app/new-game.service';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {
  winner:any;
  roomId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataStorage: DataStorageService,
    private newGameServive: NewGameService,
  ) { }

  ngOnInit(): void {
    if (window.history.state.winner !== undefined) {
      this.winner = window.history.state.winner;
    } else {
      this.dataStorage.fetchStartedGame(this.route.snapshot.params['key'])
      .subscribe(
        data => {
          // TODO check if room exists
          const roomData = Object.assign({}, ...data);
          this.winner = this.newGameServive.winner(roomData);
          this.roomId = roomData.id;
        }
      );
    }
  }

  goHome() {
    this.dataStorage.deleteRoom(this.roomId);
    this.router.navigate(['/']);
  }
}
