import { Component, OnInit } from '@angular/core';
import { NewGameService } from '../new-game.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  navbarCollapsed:boolean = true;
  pageNotFound:boolean = false;
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
  }

  get players() {
    return this.newGameService.getPlayers();
  }

}
