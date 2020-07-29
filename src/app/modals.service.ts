import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

import { NameModalComponent } from './modals/name-modal/name-modal.component';
import { RoomModalComponent } from './modals/room-modal/room-modal.component';
import { TellStoryComponent } from './modals/tell-story/tell-story.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { RulesComponent } from './modals/rules/rules.component';
import { LeaveComponent } from './modals/leave/leave.component';

@Injectable({providedIn: 'root'})
export class ModalsService {
  hostOrJoin = new BehaviorSubject<string>('host');
  selectedCard = new BehaviorSubject<number>(null);
  leaveRoute = new BehaviorSubject<boolean>(false);

  constructor(
    private modalService: NgbModal
  ) {}

  open(modal:string) {
    let modalComponent:any;

    let size = 'sm';
    let windowClass = '';
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
      case 'leave':
        modalComponent = LeaveComponent;
        break;
      case 'tellStory':
        modalComponent = TellStoryComponent;
        size = 'lg';
        break;
      case 'rules':
        modalComponent = RulesComponent;
        size = 'xl';
        windowClass = 'rules-modal';
        break;
      default:
        modalComponent = NameModalComponent;
    }

    this.modalService.open(modalComponent, {
      centered: true,
      size: size,
      windowClass: windowClass
    });
  }

  close() {
    this.modalService.dismissAll();
  }

}
