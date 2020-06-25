import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-room-modal',
  templateUrl: './room-modal.component.html',
  styleUrls: ['../modals.component.scss'],
})
export class RoomModalComponent implements OnInit, OnDestroy {
  room : string;
  @ViewChild('close') close;
  subscription: Subscription;
  fullRoom: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  joinGame(room:string) {
    this.subscription = this.dataStorage.addPlayersToRoom(room).pipe(take(1))
      .subscribe((response) => {
        const roomData:any = Object.assign({}, ...response);

        if (roomData.hasOwnProperty('status') && roomData.status == 'full') {
          this.fullRoom = true;
        } else {
          this.dataStorage.updateRoom(roomData.players, room, roomData.id)
          .then(() => {
            this.close.nativeElement.click();
            this.router.navigate(['room', room], { relativeTo: this.route })
          })
          .catch(function(error) {
            console.error("Error adding players to an existing room: ", error);
          });
        }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
