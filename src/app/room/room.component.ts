import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewGameService } from '../new-game.service';
import { DataStorageService } from '../data-storage.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalsService } from '../modals.service';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  navbarCollapsed:boolean = true;
  @ViewChild('playersComponent') playersComponent: any;
  leaveGameSub: Subscription;
  fetchRoomSub: Subscription;

  constructor(
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalsService
  ) { }

  ngOnInit(): void {
    this.modalService.close();
    const room: string = this.route.snapshot.params['key'];

    const uid = JSON.parse(localStorage.getItem('uid'));
    if (uid == null) {
      this.modalService.open('enterName');
      return;
    }

    this.fetchRoomSub = this.dataStorage.fetchRoom(room)
      .subscribe(result =>  {
        if (Object.keys(result).length === 0) {
          return { status: 'not-found'};
        }

        const roomData = Object.assign({}, ...result);

        if (roomData.newPlayer) {
          const message = 'New player joined!';
          this.dataStorage.updateRoom(roomData.players, room, roomData.id, message);
        }

        this.newGameService.setPlayersPerRoom(roomData.players);
        this.dataStorage.playersPerRoom.next(roomData);
    });
  }

  leaveGame(logout = false) {
    const room = this.playersComponent.room;
    const uid = JSON.parse(localStorage.getItem('uid'));

    if (typeof room == 'undefined') {
      this.router.navigate(['/']);
      if (logout) {
        this.newGameService.removeUsername();
      }
      return;
    }

    this.leaveGameSub = this.dataStorage.playersPerRoom.subscribe(
      data => {
        const playerToRemove = data.players.find(players => { return players.uid == uid.toString() });

        if (typeof playerToRemove != 'undefined') {
          playerToRemove.name = '';
          playerToRemove.uid = 0;
          // TODO reset other fields

          const message = 'One player left!';
          this.dataStorage.updateRoom(data.players, room, data.id, message);

          if (logout) {
            this.newGameService.removeUsername();
          }
          this.router.navigate(['/']);
        }
      }
    );
  }

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  ngOnDestroy() {
    if (this.fetchRoomSub) {
      this.fetchRoomSub.unsubscribe();
    }

    if (this.leaveGameSub) {
      this.leaveGameSub.unsubscribe();
    }
  }

}
