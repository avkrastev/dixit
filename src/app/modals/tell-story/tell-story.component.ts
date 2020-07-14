import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalsService } from 'src/app/modals.service';
import { DataStorageService } from 'src/app/data-storage.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-tell-story',
  templateUrl: './tell-story.component.html',
  styleUrls: ['../modals.component.scss']
})
export class TellStoryComponent implements OnInit {
  selectedCard: number;
  @ViewChild('close') close;

  constructor(
    public activeModal: NgbActiveModal,
    private modalsService: ModalsService,
    private dataStore: DataStorageService,
    private router: Router
  )
  { }

  ngOnInit(): void {
    this.modalsService.selectedCard.subscribe(
      (card:number) => {
        this.selectedCard = card;
      }
    );
  }

  tellStory(story) {
    let currentURL = this.router.url.split('/');
    let roomParamIndex = currentURL.findIndex(element => {return element == 'room'});
    const uid = JSON.parse(localStorage.getItem('uid'));

    if (typeof roomParamIndex != 'undefined') {
      this.dataStore.fetchRoom(currentURL[++roomParamIndex])
      .pipe(first())
      .subscribe(data => {
        const roomData = Object.assign({}, ...data);
        const selectedCards = { [uid]: { 'card': this.selectedCard }};

        const storyTeller = roomData.players.find(players => { return players.storyteller == true });
        const cardsIndex = Object.keys(storyTeller.cards).find(key => storyTeller.cards[key] === this.selectedCard);
        delete storyTeller.cards[cardsIndex];

        const message = 'The story has been told.';
        this.dataStore.updateRoom({ ...roomData, selectedCards, story: story}, message);
      });
    }

    this.close.nativeElement.click();
  }

}
