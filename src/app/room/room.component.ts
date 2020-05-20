import { Component, OnInit } from '@angular/core';
import { NewGameService } from '../new-game.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(private newGameService: NewGameService) { }

  ngOnInit(): void {
  }

  logout() {
    this.newGameService.removeUsername();
  }

}
