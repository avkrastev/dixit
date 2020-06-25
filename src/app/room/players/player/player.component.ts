import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() player: Player;
  @Input() index: number;

  constructor() { }

  ngOnInit(): void {
  }

  changePlayerColor(color:string) {

  }

}
