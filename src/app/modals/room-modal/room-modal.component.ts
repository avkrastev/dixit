import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-modal',
  templateUrl: './room-modal.component.html',
  styleUrls: ['../modals.component.scss'],
})
export class RoomModalComponent implements OnInit, OnDestroy {
  room: string;
  nonExistingRoom: boolean = false;
  fullRoom: boolean = false;
  fetchRoomSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  joinGame(room:string) {
    this.fetchRoomSub = this.dataStorage.fetchRoom(room)
    .subscribe(data =>  {
      if (Object.keys(data).length === 0) {
        this.nonExistingRoom = true;
        return;
      }

      const roomData = Object.assign({}, ...data);

      switch (roomData.status) {
        case 'not-found':
          this.nonExistingRoom = true;
          break;
        case 'full':
          this.fullRoom = true;
          break;
        default:
          this.router.navigate(['/room', room]);
      }
    });
  }

  ngOnDestroy() {
    if (this.fetchRoomSub) {
      this.fetchRoomSub.unsubscribe();
    }
  }

}
