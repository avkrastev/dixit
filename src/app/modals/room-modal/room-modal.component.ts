import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-room-modal',
  templateUrl: './room-modal.component.html',
  styleUrls: ['../modals.component.scss']
})
export class RoomModalComponent implements OnInit {
  username:string;
  usernameBtnDisabled = true;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  joinGame() {

  }

}
