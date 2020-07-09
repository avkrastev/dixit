import { Injectable } from '@angular/core';
import { Player } from './models/player.model';
import { NewGameService } from 'src/app/new-game.service';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Room } from './models/room.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  players:Room[] = [];
  playersPerRoom = new BehaviorSubject<any>(null);
  roomStatus = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private newGameService: NewGameService,
    private db: AngularFirestore,
  ) {}

  createNewRoom(room:string) {
    const host = JSON.parse(localStorage.getItem('username'));
    const uid = JSON.parse(localStorage.getItem('uid'));

    const playersArray = [
      //new Player(name, color, ready, points, storyteller, uid, host),
      new Player(host, 'blue', false, 0, true, uid, true),
      new Player('', 'green', false, 0, false, 0, false),
      new Player('', 'red', false, 0, false, 0, false),
      new Player('', 'yellow', false, 0, false, 0, false),
      new Player('', 'lightblue', false, 0, false, 0, false),
      new Player('', 'white', false, 0, false, 0, false),
      new Player('', 'black', false, 0, false, 0, false),
      new Player('', 'grey', false, 0, false, 0, false),
    ];

    const playersObj = playersArray.map((obj)=> {return Object.assign({}, obj)});

    return this.db.collection('rooms').add(
      {
        key: room,
        players: playersObj,
        gameStarted: false
      }
    );
  }

  newGame() {
    const room = this.newGameService.hostNewGame();

    this.createNewRoom(room)
      .then(() => {
        this.router.navigate(['/room', room]);
      })
      .catch(function(error) {
        console.error("Error adding players to new room: ", error);
      }
    );
  }

  fetchRoom(room:string) {
    let newPlayerJoined = false;

    return this.db.collection('rooms', ref => ref.where('key', '==', room)).snapshotChanges().pipe(
      map(actions => {
        const filteredData = actions.map(a => {
          const data:any = a.payload.doc.data();
          const id = a.payload.doc.id;
          const uid = JSON.parse(localStorage.getItem('uid'));

          const newPlayer = data.players.find(players => { return players.uid == uid.toString() });

          if (typeof newPlayer == 'undefined') {
            const emptySlot = data.players.find(players => { return players.name == '' || players.name == null });

            if (typeof emptySlot == 'undefined') {
              return { ...data as {}, status: 'full'};
            } else if (data.gameStarted) {
              return { ...data as {}, status: 'game-started', newPlayer: newPlayerJoined };
            } else {
              emptySlot.name = JSON.parse(localStorage.getItem('username'));
              emptySlot.uid = uid;

              newPlayerJoined = true;
            }
          }

          return { id, ...data as {}, newPlayer: newPlayerJoined };
        }).filter(result => Object.keys(result).length > 0);

        return filteredData;
      })
    )
  }

  fetchStartedGame(room:string) {
    return this.db.collection('rooms', ref => ref.where('key', '==', room).where('gameStarted', '==', true)).snapshotChanges().pipe(
      map(actions => {
        const filteredData = actions.map(a => {
          const data:any = a.payload.doc.data();

          return { ...data as {} };
        }).filter(result => Object.keys(result).length > 0);

        return filteredData;
      })
    )
  }

  deleteRoom(id:string){
    return this.db.collection('rooms').doc(id).delete();
  }

  updateRoom(data, message = '') {
    return this.db.collection('rooms').doc(data.id).set({
      ...data
    }).then(function() {
      console.log(message);
    })
    .catch(function(error) {
      console.error('Error storing data:', error);
    });
  }

}
