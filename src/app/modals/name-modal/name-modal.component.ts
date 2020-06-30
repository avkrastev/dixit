import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGameService } from 'src/app/new-game.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';
import { Subscription } from 'rxjs';
import { ModalsService } from 'src/app/modals.service';

@Component({
  selector: 'app-name-modal',
  templateUrl: './name-modal.component.html',
  styleUrls: ['../modals.component.scss']
})
export class NameModalComponent implements OnInit, OnDestroy {
  username:string;
  usernameBtnDisabled = true;
  @ViewChild('close') close;
  fetchRoomSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
    private modalsService: ModalsService,
    private router: Router,
    private route: ActivatedRoute,
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
    let currentURL = this.router.url.split('/');
    let roomParamIndex = currentURL.findIndex(element => {return element == 'room'});

    const hostOrJoin = this.modalsService.hostOrJoin.getValue();

    if (this.router.url == '/' && hostOrJoin == 'host') {
      this.dataStorage.newGame();
    } else if (hostOrJoin == 'join') {
      this.modalsService.open('enterRoom');
    } else if (typeof roomParamIndex != 'undefined') {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';

      this.router.navigate(['/room', currentURL[++roomParamIndex]]);
    }

    this.close.nativeElement.click();
  }

  ngOnDestroy() {
    if (this.fetchRoomSub) {
      this.fetchRoomSub.unsubscribe();
    }
  }

}
