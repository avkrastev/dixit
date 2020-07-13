import { Component, OnInit, HostListener } from '@angular/core';
import { DataStorageService } from 'src/app/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewGameService } from 'src/app/new-game.service';
import { CanComponentDeactivate } from '../can-deactivate-guard.service';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit, CanComponentDeactivate {
  cards: any;
  roomData: any;
  myName: string;
  myVote: string = '';
  storyTeller: any;
  winner:any;
  leaderboard:any;
  players: any;
  leaderBoardShown: boolean = false;
  loading: boolean = true;
  uid: number;
  host: boolean = false;
  myPoints: string;

  constructor(
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private newGameServices: NewGameService
  )
  { }

  ngOnInit(): void {
    const room = this.route.snapshot.params['key'];

    if (room == 404) {
      this.router.navigate(['/room/404']);
    }

    this.dataStorage.fetchStartedGame(room)
    .subscribe(
      data => {
        // TODO check if room exists
        this.roomData = Object.assign({}, ...data);
        this.uid = JSON.parse(localStorage.getItem('uid'));

        this.players = this.roomData.players.filter(players => { return players.name != '' });
        this.storyTeller = this.roomData.players.find(players => { return players.storyteller == true });
        this.cards = this.shuffle(this.roomData.selectedCards);
        this.host = this.roomData.players.find(players => { return players.host == true && players.uid == this.uid.toString() });

        let counter = 0;
        for (let key in this.roomData.selectedCards) {
          if (this.roomData.selectedCards[key]['choosenBy'] !== undefined) {
            const myVote = this.roomData.selectedCards[key]['choosenBy'].find(voter => { return voter.uid == this.uid.toString() });
            if (myVote !== undefined) {
              this.myVote = myVote.color; // boolean?
            }
            counter += this.roomData.selectedCards[key]['choosenBy'].length;

            if (counter == this.players.length - 1) {
              this.loading = false;
            }
          }
        }

        if (this.loading === false && this.roomData.round == this.route.snapshot.params['round']) {
          this.scoring();
        }

        if (this.roomData.nextRound) {
          this.router.navigate(['/room/'+room+'/round/'+this.roomData.round]);
        }

        this.winner = this.newGameServices.winner(this.roomData);
        if (Object.keys(this.winner).length > 0) {
          this.router.navigate(['/room/'+room+'/winner'], {state: {winner: this.winner}});
        }

        // this.leaderboard = Array(31);
      }
    );
  }

  nextRound() {
    this.resetData();
    this.dataStorage.updateRoom({ ...this.roomData, nextRound: true });
  }

  private shuffle(obj) {
    return Object.keys(obj)
    .map((key) => ({key, value: obj[key]}))
    .sort((a, b) => b.key.localeCompare(a.key))
    .reduce((acc, e) => {
      acc[e.key] = e.value;
      return acc;
    }, {});
  }

  finalCard(card) {
    const uid = JSON.parse(localStorage.getItem('uid'));
    const player = this.roomData.players.find(players => { return players.uid == uid.toString() });

    for (let key in this.roomData.selectedCards) {
      if (this.roomData.selectedCards[key].card == card.value.card) {

        if (this.roomData.selectedCards[key]['choosenBy'] === undefined) {
          let choosenBy = [{uid, name: player.name, color: player.color}];

          this.roomData.selectedCards[key]['choosenBy'] = choosenBy;
        } else {
          let choosenBy = this.roomData.selectedCards[key]['choosenBy'];
          choosenBy.push({uid, name: player.name, color: player.color});
        }
      }
    }

    this.dataStorage.updateRoom({ ...this.roomData});
  }

  log(val) {
    console.log(val);
  }

  getPlayerByUID(uid) {
    const player = this.roomData.players.find(players => { return players.uid == uid.toString() });
    if (player !== undefined) {
      return player.name;
    }
    return 'Somebody';
  }

  private scoring() {
    let storyCardGuesses = 0;
    const storyCard = this.roomData.selectedCards[this.storyTeller.uid].card;
    let listeners = [];

    for (let key in this.roomData.selectedCards) {
      if (this.roomData.selectedCards[key]['choosenBy'] !== undefined) {
        this.myPoints = '';

        for (let player in this.roomData.selectedCards[key]['choosenBy']) {
          if (this.roomData.selectedCards[key].card == storyCard) {
            // 3 points for players who correctly guess the storyteller's card
            const listener = this.roomData.players.find(players => { return players.storyteller == false &&
                                                                            players.uid == this.roomData.selectedCards[key]['choosenBy'][player].uid.toString() });
            listener.points += 3;
            if (listener.uid == this.uid) {
              this.myPoints = listener.name + ', you receive 3 points by guessing the correct card!';
            }

            storyCardGuesses++;
          } else if (this.roomData.selectedCards[key]['choosenBy'][player].uid != key) {
            // +1 points for player who provided a card that is chosen by any other player.
            const listener = this.roomData.players.find(players => { return players.uid == key.toString() });
            listener.points += 1;
            if (listeners.includes(listener.uid)) continue;
            listeners.push(listener.uid);
          }
        }
      }
    }

    for (let k in listeners) {
      if (listeners[k] == this.uid) {
        for (let contributor in this.roomData.selectedCards[listeners[k]]['choosenBy']) {
          if (this.myPoints != '') {
            this.myPoints += ' \n + 1 point from ' + this.roomData.selectedCards[listeners[k]]['choosenBy'][contributor].name;
          } else {
            this.myPoints = ' + 1 point from ' + this.roomData.selectedCards[listeners[k]]['choosenBy'][contributor].name;
          }
        }
      }
    }

    if (this.myPoints == '') {
      this.myPoints = 'You don\'t get any points this round!'
    }

    // 3 points for the storyteller if someone, but not everybody, guesses their card
    if (storyCardGuesses > 0 && storyCardGuesses < this.players.length - 1) {
      this.storyTeller.points += 3;
      if (this.storyTeller.uid == this.uid) {
        this.myPoints = this.storyTeller.name + ', you receive 3 points because someone but not everyone guessed your card!';
      }
    } else {
      if (this.storyTeller.uid == this.uid) {
        if (storyCardGuesses == 0) {
          this.myPoints = this.storyTeller.name + ', you don\'t receive any points because nobody guessed your card!';
        }
        if (storyCardGuesses == this.players.length - 1) {
          this.myPoints = this.storyTeller.name + ', you don\'t receive any points because everybody guessed your card!';
        }
      }
    }

    this.roomData.round++;
    this.roomData.nextRound = false;
    // set points
    this.dataStorage.updateRoom({ ...this.roomData });
  }

  private resetData() {
    // move to the next storyteller
    let storyTellerIndex = +Object.keys(this.roomData.players).find(key => this.roomData.players[key] === this.storyTeller);
    this.roomData.players[storyTellerIndex].storyteller = false;

    if (storyTellerIndex == this.players.length - 1) {
      storyTellerIndex = 0;
    } else {
      storyTellerIndex++;
    }
    delete this.roomData.story;

    this.roomData.selectedCards = {};
    this.roomData.players[storyTellerIndex].storyteller = true;

    // add new card to each player
    if (this.roomData.round > 1) {
      for (let player in this.players) {
        if (this.players[player].roundFinished != undefined) {
          this.players[player].roundFinished = false;
        }
        const randomNumber = Math.floor(Math.random() * (Object.keys(this.roomData.remainingCards).length - 0 + 1)) + 0;

        for (let i = 0; i < 6; i++) {
          if (this.players[player].cards[i] == undefined) {
            this.players[player].cards[i] = this.roomData.remainingCards[randomNumber];
          }
        }
        let remainingCards = Object.values(this.roomData.remainingCards);
        remainingCards.splice(randomNumber, 1);
        this.roomData.remainingCards = { ...remainingCards };
      }
    }

    this.dataStorage.updateRoom({ ...this.roomData });
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate (): Observable<boolean> | Promise<boolean> | boolean {
    return confirm('Are you sure you want to leave?');
  }
}
