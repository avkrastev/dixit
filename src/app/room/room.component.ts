import { Component, OnInit } from '@angular/core';
import { NewGameService } from '../new-game.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  navbarCollapsed:boolean = true;
  pageNotFound:boolean = false;
  players:Player[];
  room:string;

  constructor(
    private newGameService: NewGameService,
    private route: ActivatedRoute
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
          this.players = this.newGameService.getPlayersPerRoom(this.room);
        }
			}
		);
  }

  logout() {
    this.newGameService.removeUsername();
  }

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  changePlayerColor(color) {
    console.log(color);
    console.log(this.room);
    console.log(this.players);
  }

}
