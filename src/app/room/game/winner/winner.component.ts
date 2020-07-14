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
  winner: any;
  roomId: string;
  players: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataStorage: DataStorageService,
    private newGameServive: NewGameService,
  ) { }

  ngOnInit(): void {
    this.dataStorage.fetchStartedGame(this.route.snapshot.params['key'])
    .subscribe(
      data => {
        const roomData = Object.assign({}, ...data);
        if (Object.keys(roomData).length <= 0) {
          this.router.navigate(['/']);
          return;
        }
        this.winner = this.newGameServive.winner(roomData);
        this.roomId = roomData.id;
        this.players = roomData.players.filter(players => { return players.name != '' })
                                       .sort(function(a, b) { return b.points - a.points; });
      }
    );
  }

  goHome() {
    this.dataStorage.deleteRoom(this.roomId);
    this.router.navigate(['/']);
  }
}
