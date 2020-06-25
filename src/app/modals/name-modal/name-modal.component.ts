import { Component, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGameService } from 'src/app/new-game.service';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['../modals.component.scss']
})
export class NameModalComponent implements OnInit {
  username:string;
  usernameBtnDisabled = true;
  @ViewChild('close') close;

  constructor(
    public activeModal: NgbActiveModal,
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  checkUsername(event: any) {
    this.username = event.target.value;

    this.usernameBtnDisabled = true;

    if (this.username && this.username.trim() != '') {
      this.usernameBtnDisabled = false;
    }
  }

  setUsername() {
    this.newGameService.storeName(this.username);

    if (this.router.url == '/') {
      const roomCode = this.newGameService.hostNewGame();
      this.dataStorage.createNewRoom(roomCode);
    }

    this.close.nativeElement.click();
  }

}
