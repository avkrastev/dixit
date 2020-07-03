import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalsService } from 'src/app/modals.service';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['../modals.component.scss']
})
export class ConfirmComponent implements OnInit {
  selectedCard:number;
  @ViewChild('close') close;

  constructor(
    public activeModal: NgbActiveModal,
    private modalsService: ModalsService,
    private router: Router,
    private dataStore: DataStorageService
  )
  { }

  ngOnInit(): void {
    this.modalsService.selectedCard.subscribe(
      (card:number) => {
        this.selectedCard = card;
      }
    );
  }

  selectCard(card) {
    let currentURL = this.router.url.split('/');
    let roomParamIndex = currentURL.findIndex(element => {return element == 'room'});
    const uid = JSON.parse(localStorage.getItem('uid'));

    if (typeof roomParamIndex != 'undefined') {
      this.dataStore.fetchRoom(currentURL[++roomParamIndex])
      .pipe(first())
      .subscribe(data => {
        const roomData = Object.assign({}, ...data);
        const selectedCards = { ...roomData.selectedCards, [uid]: card };

        const player = roomData.players.find(players => { return players.uid == uid.toString() });
        const cardsIndex = Object.keys(player.cards).find(key => player.cards[key] === this.selectedCard);
        delete player.cards[cardsIndex];
        player.roundFinished = true;

        const message = player.name+' has selected a card.';
        this.dataStore.updateRoom({ ...roomData, selectedCards, story: roomData.story}, message);
      });
    }

    this.close.nativeElement.click();
  }

}
