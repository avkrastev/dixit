import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NameModalComponent } from './modals/name-modal/name-modal.component';
import { RoomModalComponent } from './modals/room-modal/room-modal.component';
import { TellStoryComponent } from './modals/tell-story/tell-story.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { BehaviorSubject } from 'rxjs';
import { RulesComponent } from './modals/rules/rules.component';

@Injectable({providedIn: 'root'})
export class ModalsService {
  hostOrJoin = new BehaviorSubject<string>('host');
  selectedCard = new BehaviorSubject<number>(null);

  constructor(
    private modalService: NgbModal
  ) {}

  open(modal:string) {
    let modalComponent:any;

    let size = 'sm';
    switch(modal) {
      case 'enterName':
        modalComponent = NameModalComponent;
        break;
      case 'enterRoom':
        modalComponent = RoomModalComponent;
        break;
      case 'confirm':
        modalComponent = ConfirmComponent;
        break;
      case 'tellStory':
        modalComponent = TellStoryComponent;
        size = 'lg';
        break;
      case 'rules':
        modalComponent = RulesComponent;
        size = 'lg';
        break;
      default:
        modalComponent = NameModalComponent;
    }

    this.modalService.open(modalComponent, {
      centered: true,
      size: size
    });
  }

  close() {
    this.modalService.dismissAll();
  }

}
