import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() player: Player;
  @Input() index: number;
  @Output() changeColor = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  changePlayerColor(color:string, event) {
    const nameSpan = event.target.querySelector('span.name');

    if (nameSpan != null && nameSpan.innerText === '') {
      this.changeColor.emit(color);
    }
  }

}
