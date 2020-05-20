import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGameService } from '../new-game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  username:string;
  usernameBtnDisabled = true;
  @ViewChild('enterNameModal') enterNameModal: ElementRef;
  @ViewChild('enterRoomModal') enterRoomModal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private newGameService: NewGameService,
    private router: Router,
  ) {
    this.username = JSON.parse(localStorage.getItem('username'));
  }

  setUsername(event: any) { // without type info
    this.username = event.target.value;
    this.usernameBtnDisabled = true;

    if (this.username && this.username.trim() != '') {
      this.usernameBtnDisabled = false;
    }
  }

  newGame() {
    if (!this.username) {
      this.open(this.enterNameModal);
    } else {
      this.router.navigate(['room']);
    }
  }

  join() {
    const modal = !this.username ? this.enterNameModal : this.enterRoomModal;
    this.open(modal);
  }

  accessRoom(event: any) {

  }

  private open(content) {
    this.modalService.open(content, {
      centered: true,
      size: 'sm'
    }).result.then(
    (result) => {
        if (content == this.enterNameModal) {
          if (result && result.trim() != '') {
            this.newGameService.storeName(result);
            this.router.navigate(['room']);
          }
        }
        if (content == this.enterRoomModal) {
          // TODO
        }
      },
    (close) => {

    });
  }

  ngOnInit(): void {}
}
