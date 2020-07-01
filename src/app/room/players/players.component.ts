import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewGameService } from 'src/app/new-game.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { map, filter, first } from 'rxjs/operators';
import { DataStorageService } from 'src/app/data-storage.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, OnDestroy {
  pageNotFound: boolean = false;
  loading: boolean = true;
  players: Room[];
  room: string;
  playerReadyBtn: boolean = false;
  startBtn: boolean = false;
  notReadyPlayersCount: number;
  allPlayersCount: number;
  hostPlayer: boolean = false;
  subscription : Subscription;

  constructor(
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.subscription = combineLatest(
      this.route.params,
      this.dataStorage.playersPerRoom
    ).pipe(
        //filter(([params, players]) => players !== null),
        map(([params, players]) => {
          if (params['key'] == '404') {
            this.pageNotFound = true;
          } else {
            this.room = params['key'];
            this.newGameService.checkIfUserLogged();
          }
          return players || {};
        })
    ).subscribe(roomData => {
      if (Object.keys(roomData).length <= 0) {
        return;
      }
      this.loading = false;
      this.players = roomData.players;

      const uid = JSON.parse(localStorage.getItem('uid'));
      const ownPlayer = roomData.players.find(players => { return players.uid == uid.toString() });
      const readyPlayers = roomData.players.filter(players => { return players.ready == true });
      const notReadyPlayersCount = roomData.players.filter(players => { return players.name != '' && players.ready == false });
      const allPlayersCount = roomData.players.filter(players => { return players.name != '' });
      const hostPlayer = roomData.players.find(players => { return players.host });

      if (typeof ownPlayer !== 'undefined') {
        this.playerReadyBtn = ownPlayer.ready == true ? true : false;
      }

      if (typeof notReadyPlayersCount !== 'undefined') {
        this.notReadyPlayersCount = notReadyPlayersCount.length;
      }

      if (typeof allPlayersCount !== 'undefined') {
        this.allPlayersCount = allPlayersCount.length;
      }

      if (typeof hostPlayer !== 'undefined') {
        this.hostPlayer = hostPlayer.uid == uid ? true : false;
      }

      if (typeof readyPlayers !== 'undefined' && readyPlayers.length > 2 && this.allPlayersCount >= 3) {
        this.startBtn = true;
      }
    });
  }

  changePlayerColor(color:string) {
    this.dataStorage.playersPerRoom
    .pipe(first())
    .subscribe(data => {
      this.loading = false;
      const name = JSON.parse(localStorage.getItem('username'));
      const uid = JSON.parse(localStorage.getItem('uid'));
      const ownPlayer = data.players.find(players => { return players.uid == uid.toString() });

      if (typeof ownPlayer !== 'undefined') {
        const newColorSlot = data.players.find(players => { return players.color == color });
        if (typeof newColorSlot !== 'undefined') {
          newColorSlot.name = name;
          newColorSlot.uid = uid;
          newColorSlot.host = ownPlayer.host;
          newColorSlot.ready = ownPlayer.ready;

          this.newGameService.resetPlayerFields(ownPlayer);
        }
        const message = 'Player ' + newColorSlot.name + ' changed its color to ' + color + '!';
        this.dataStorage.updateRoom(data.players, data.key, data.id, message);

        this.newGameService.setPlayersPerRoom(data.players); // TODO check if this is needed
        this.dataStorage.playersPerRoom.next(data);
      }
    })
  }

  playerReady(ready) {
    this.dataStorage.playersPerRoom
    .pipe(first())
    .subscribe(data => {
      this.loading = false;
      const uid = JSON.parse(localStorage.getItem('uid'));
      const ownPlayer = data.players.find(players => { return players.uid == uid.toString() });

      if (typeof ownPlayer !== 'undefined') {
        ownPlayer.ready = !ready;
        const message = !ready ? 'Player ' + ownPlayer.name +' is ready!' : 'Player ' + ownPlayer.name +' is not ready!';
        this.dataStorage.updateRoom(data.players, data.key, data.id, message);

        this.newGameService.setPlayersPerRoom(data.players); // TODO check if this is needed
        this.dataStorage.playersPerRoom.next(data);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
