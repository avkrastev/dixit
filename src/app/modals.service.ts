import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NameModalComponent } from './modals/name-modal/name-modal.component';
import { RoomModalComponent } from './modals/room-modal/room-modal.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ModalsService {
  hostOrJoin = new BehaviorSubject<string>('host');

  constructor(
    private modalService: NgbModal
  ) {}

  open(modal:string) {
    let modalComponent:any;

    switch(modal) {
      case 'enterName':
        modalComponent = NameModalComponent;
        break;
      case 'enterRoom':
        modalComponent = RoomModalComponent;
        break;
      default:
        modalComponent = NameModalComponent;
    }

    this.modalService.open(modalComponent, {
      centered: true,
      size: 'sm'
    });
  }

  close() {
    this.modalService.dismissAll();
  }

}
