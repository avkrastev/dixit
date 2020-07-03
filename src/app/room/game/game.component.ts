import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DataStorageService } from 'src/app/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { ModalsService } from 'src/app/modals.service';
import { NewGameService } from 'src/app/new-game.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  fetchRoomSub: Subscription;
  cards: any;
  cardsCount: number;
  storyteller: boolean = false;
  storytellerName: string;
  waitingForTale: boolean = true;
  storyText: string;
  players: any;
  status: string = '';

  constructor(
    private modalsService: ModalsService,
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
        const roomData = Object.assign({}, ...data);
        const username = JSON.parse(localStorage.getItem('username'));
        const uid = JSON.parse(localStorage.getItem('uid'));

        const player = roomData.players.find(players => { return players.uid == uid.toString() && players.name == username });

        if (typeof player == 'undefined') {
          this.status = 'This game has already been started!';
          // TODO Pass data to 404 or another route?
          this.router.navigate(['/room/404']);
          return;
        }

        const storyTeller = roomData.players.find(players => { return players.storyteller == true });
        const listeners = roomData.players.filter(players => { return players.storyteller == false && players.name != ''});

        if (typeof roomData.selectedCards != 'undefined' && Object.keys(listeners).length + 1 == Object.keys(roomData.selectedCards).length) {
          this.router.navigate(['finish'], {relativeTo: this.route});
          return;
        }

        this.cards = player.cards;
        this.storytellerName = storyTeller.name;

        if (storyTeller.uid == uid) {
          this.storyteller = storyTeller.storyteller;
        }

        if (typeof roomData.cards != 'undefined') {
          this.cardsCount = Object.keys(roomData.cards).length;
        }

        if (typeof roomData.story != 'undefined') {
          this.storyText = roomData.story;
          this.waitingForTale = false;
        }
        this.players = listeners;
      }
    );
  }

  tellStory(card) {
    this.modalsService.selectedCard.next(card);
    this.modalsService.open('tellStory');
  }

  listenerCardChoice(card) {
    // TODO should I use other subject?
    this.modalsService.selectedCard.next(card);
    this.modalsService.open('confirm');
  }

  ngOnDestroy() {
    if (this.fetchRoomSub) {
      this.fetchRoomSub.unsubscribe();
    }
  }

  // For debugging
  log(val) {
    console.log(val);
  }


}
