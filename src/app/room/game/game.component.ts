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
  storyteller: boolean;
  storytellerName: string;
  waitingForTale: boolean = true;
  storyText: string;
  players: any;

  constructor(
    private modalsService: ModalsService,
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
    private router: Router,
  )
  { }

  ngOnInit(): void {
    const room: string = this.route.snapshot.params['key'];

    this.dataStorage.fetchPlayerData(room).subscribe(
      player => {
        // TODO status check (not found)
        const playerData = Object.assign({}, ...player);

        this.cards = playerData.cards;
        this.cardsCount = Object.keys(playerData.cards).length;
        this.storyteller = playerData.storyteller;
        this.storytellerName = playerData.teller;

        if (typeof playerData.storyText != 'undefined') {
          this.storyText = playerData.storyText;
          this.waitingForTale = false;
        }
        this.players = playerData.listeners;
      }
    );
  }

  tellStory(card) {
    this.modalsService.selectedCard.next(card);
    this.modalsService.open('tellStory');
  }

  listenerCardChoice(card) {
    console.log(card);
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
