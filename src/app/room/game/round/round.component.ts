import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {
  cards: any;
  roomData: any;
  voted: boolean = false;
  myName: string;
  myVote: string;

  constructor(
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
    private router: Router,
  )
  { }

  ngOnInit(): void {
    const room = this.route.snapshot.params['key'];
    if (room == 404) {
      this.router.navigate(['/room/404']);
    }

    this.dataStorage.fetchStartedGame(room).subscribe(
      data => {
        // TODO check if room exists
        this.roomData = Object.assign({}, ...data);
        const uid = JSON.parse(localStorage.getItem('uid'));

        if (typeof this.roomData.playersChoice[uid] !== 'undefined') {
          this.voted = true;
          this.myName = JSON.parse(localStorage.getItem('username'));
          this.myVote = this.roomData.playersChoice[uid].value;
        }
        this.cards = this.shuffle(this.roomData.selectedCards);
      }
    );
  }

  private shuffle(obj) {
    return Object.keys(obj)
    .map((key) => ({key, value: obj[key]}))
    .sort((a, b) => b.key.localeCompare(a.key))
    .reduce((acc, e) => {
      acc[e.key] = e.value;
      return acc;
    }, {});

  }

  finalCard(card) {
    const uid = JSON.parse(localStorage.getItem('uid'));

    let playersChoice = {[uid]: card};

    this.dataStorage.updateRoom({ ...this.roomData, playersChoice: playersChoice});
  }

}
