import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewGameService } from 'src/app/new-game.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, OnDestroy {
  pageNotFound:boolean = false;
  players:Room[];
  room:string;
  subscription: Subscription;

  constructor(
    private newGameService: NewGameService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params
		.subscribe(
			(params: Params) => {
        if (params['key'] == '404') { // Page not found
          this.pageNotFound = true;
        } else {
          this.room = params['key'];
          this.newGameService.checkIfUserLogged();
        }
			}
    );

    this.subscription = this.newGameService.gameChanged
    .subscribe(
      (players: Room[]) => {
        this.players = players;
      }
    );

    this.players = this.newGameService.getPlayersPerRoom();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
