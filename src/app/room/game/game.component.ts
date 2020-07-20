import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DataStorageService } from 'src/app/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ModalsService } from 'src/app/modals.service';
import { CanComponentDeactivate } from './can-deactivate-guard.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  fetchRoomSub: Subscription;
  cards: any;
  storyteller: boolean = false;
  storyTeller: any;
  waitingForTale: boolean = true;
  storyText: string;
  players: any;
  status: string = '';
  uid: number;
  counter:any;
  listenersIntervalId;
  tellStoryBtnDisabled: boolean = false;
  fitMostBtnDisabled: boolean = false;

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
    // this.counter = { min: ('00' + 2).slice(-2), sec: ('00' + 0).slice(-2) };
    // const intervalId = this.timer();

    this.dataStorage.fetchStartedGame(room).subscribe(
      data => {
        const roomData = Object.assign({}, ...data);
        const username = JSON.parse(localStorage.getItem('username'));
        this.uid = JSON.parse(localStorage.getItem('uid'));

        if (window.history.state.playerToRemove !== undefined) {
          this.router.navigate(['/']);
          return;
        }

        const existingPlayer = roomData.players.find(players => { return players.uid == this.uid.toString() });
        if (existingPlayer == undefined) {
          this.router.navigate(['room/'+room]);
          return;
        }

        if (roomData.nextRound) {
          this.dataStorage.updateRoom({ ...roomData, nextRound: false});
        }

        const player = roomData.players.find(players => { return players.uid == this.uid.toString() && players.name == username });

        this.storyTeller = roomData.players.find(players => { return players.storyteller == true });

        const listeners = roomData.players.filter(players => { return players.storyteller == false && players.name != ''});

        if (typeof roomData.selectedCards != 'undefined' && Object.keys(listeners).length + 1 == Object.keys(roomData.selectedCards).length) {
          this.router.navigate(['finish'], {relativeTo: this.route});
          return;
        }

        this.cards = player.cards;

        if (this.storyTeller.uid == this.uid) {
          this.storyteller = this.storyTeller.storyteller;
        }

        this.tellStoryBtnDisabled = false;
        if (typeof roomData.story != 'undefined') {
          this.storyText = roomData.story;
          this.waitingForTale = false;
          this.tellStoryBtnDisabled = true;
          // clearInterval(intervalId);

          // this.counter = { min: ('00' + 2).slice(-2), sec: ('00' + 0).slice(-2) };
          // this.listenersIntervalId = this.timer();
          // console.log(this.listenersIntervalId);
        }

        this.players = listeners;
        this.fitMostBtnDisabled = player.roundFinished !== undefined ? player.roundFinished : false;
      }
    );
  }

  private timer() {
    let intervalId = setInterval(() => {
      if (this.counter.sec - 1 == -1) {
        this.counter.min -= 1;
        this.counter.min = ('00' + this.counter.min).slice(-2);
        this.counter.sec = 59;
      } else {
        this.counter.sec -= 1;
        this.counter.sec = ('00' + this.counter.sec).slice(-2);
      }

      if (this.counter.min == '00' && this.counter.sec == '00') {
        clearInterval(intervalId);

      }
    }, 1000);

    return intervalId;
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

  @HostListener('window:beforeunload')
  canDeactivate (): Observable<boolean> | Promise<boolean> | boolean {
    return confirm('Are you sure you want to leave?');
  }

  ngOnDestroy() {
    if (this.fetchRoomSub) {
      this.fetchRoomSub.unsubscribe();
    }
  }

}
