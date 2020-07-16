import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewGameService } from 'src/app/new-game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { map, filter, first, tap } from 'rxjs/operators';
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
  status: string;
  copied: string = 'copy';

  constructor(
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.subscription = combineLatest(
      this.route.params,
      this.dataStorage.playersPerRoom,
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
      this.status = '';
      const uid = JSON.parse(localStorage.getItem('uid'));
      const ownPlayer = roomData.players.find(players => { return players.uid == uid.toString() });

      if (roomData.gameStarted && typeof ownPlayer !== 'undefined') {
        this.router.navigate(['round/'+roomData.round], {relativeTo: this.route});
        return;
      } else if (roomData.gameStarted && typeof ownPlayer === 'undefined') {
        this.status = 'This game has already been started!';
        return;
      }

      this.loading = false;
      this.players = roomData.players;

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

      this.startBtn = false;
      if (typeof readyPlayers !== 'undefined' && this.allPlayersCount >= 3 && readyPlayers.length == this.allPlayersCount) {
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
        this.dataStorage.updateRoom({...data}, message);

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
        this.dataStorage.updateRoom({ ...data }, message);

        this.newGameService.setPlayersPerRoom(data.players); // TODO check if this is needed
        this.dataStorage.playersPerRoom.next(data);
      }
    })
  }

  startGame() {
    this.dataStorage.playersPerRoom
      .pipe(first())
      .subscribe(roomData =>  {
        const allPlayers = roomData.players.filter(players => { return players.name != '' });

        let allCards = Array.from(Array(125), (_, i) => i + 1);

        for (let player in allPlayers) {
          let cardsPerPlayer = [];
          for (let j = 0; j < 6; j++) {
            const randomNumber = Math.floor(Math.random() * ((allCards.length - 1) - 0 + 1)) + 0;
            cardsPerPlayer.push(allCards[randomNumber]);
            allCards.splice(randomNumber, 1);
          }

          allPlayers[player].cards = { ...cardsPerPlayer };
        }

        roomData.remainingCards = { ...allCards };
        roomData.gameStarted = true;
        roomData.round = 1;
        delete roomData.newPlayer;

        const message = 'First round started!';
        this.dataStorage.updateRoom({ ...roomData }, message);
    });
  }

  copyToClipboard(room): void {
    let listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (room));
        e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);

    this.copied = 'ready';
    setTimeout(() => {
      this.copied = 'copy';
    }, 2000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
