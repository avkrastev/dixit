import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from './models/player.model';
import { NewGameService } from 'src/app/new-game.service';
import { map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Room } from './models/room.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  players:Room[] = [];
  playersPerRoom = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private newGameService: NewGameService,
    private route: ActivatedRoute,
    private db: AngularFirestore
  ) {}

  createNewRoom(room:string) {
    const host = JSON.parse(localStorage.getItem('username'));

    const playersArray = [
      new Player(host, 'blue', false, 0, false, ''),
      new Player('', 'green', false, 0, false, ''),
      new Player('', 'red', false, 0, false, ''),
      new Player('', 'yellow', false, 0, false, ''),
      new Player('', 'lightblue', false, 0, false, ''),
      new Player('', 'white', false, 0, false, ''),
      new Player('', 'black', false, 0, false, ''),
      new Player('', 'grey', false, 0, false, ''),
    ];

    const playersObj = playersArray.map((obj)=> {return Object.assign({}, obj)});

    return this.db.collection('rooms').add(
      {
        key: room,
        players: playersObj
      }
    );
  }

  getRoom(room:string) {
    return this.db.collection('rooms').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data:any = a.payload.doc.data();

          if (data.hasOwnProperty('key') && data.key == room) {
            const id = a.payload.doc.id;
            return { id, ...data as {} };
          }

          return {};

        }).filter(result => Object.keys(result).length > 0);
      }),
      tap(data => {
          const roomData = Object.assign({}, ...data);
          // TODO check the logic
          if (Object.keys(roomData.players).length === 0) {
            this.router.navigate(['/room/404']);
          } else {
            this.newGameService.setPlayersPerRoom(roomData.players);
            this.playersPerRoom.next(roomData.players);
          }
      })
    );
  }

  addPlayersToRoom(room:string) {
    return this.db.collection('rooms').snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data:any = a.payload.doc.data();

            if (data.hasOwnProperty('key') && data.key == room) {
              const id = a.payload.doc.id;
              const emptySlot = data.players.find(players => { return players.name == '' });

              if (typeof emptySlot == 'undefined') {
                return { ...data as {}, status: 'full'};
              } else {
                emptySlot.name = JSON.parse(localStorage.getItem('username'));
              }

              return { id, ...data as {} };
            }

            return {};

          }).filter(result => Object.keys(result).length > 0);
        })
    );
  }

  updateRoom(players:object, room:string, id:string) {
    return this.db.collection('rooms').doc(id).set({
        key: room,
        players: players
      });
  }
}
