import { Component, OnInit, HostListener } from '@angular/core';
import { DataStorageService } from 'src/app/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NewGameService } from 'src/app/new-game.service';
import { CanComponentDeactivate } from '../can-deactivate-guard.service';
import { ModalsService } from 'src/app/modals.service';

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
  hostname: any;
  myChoice: any;
  story: string;
  winnerBtn: boolean = false;
  nextRoundBtn: boolean = false;

  constructor(
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private newGameServices: NewGameService,
    private modalsService: ModalsService,
  )
  { }

  ngOnInit(): void {
    const room = this.route.snapshot.params['key'];

    if (room == 404) {
      this.router.navigate(['/room/404']);
    }
    this.modalsService.close();

    this.dataStorage.fetchStartedGame(room)
    .subscribe(
      data => {
        this.roomData = Object.assign({}, ...data);
        this.uid = JSON.parse(localStorage.getItem('uid'));
        if (this.uid === null) {
          this.modalsService.open('enterName');
        }

        if (window.history.state.playerToRemove !== undefined) {
          this.router.navigate(['/']);
          return;
        }

        const existingPlayer = this.roomData.players.find(players => { return players.uid == this.uid.toString() });

        if (existingPlayer == undefined) {
          this.router.navigate(['room/'+room]);
          return;
        }

        this.players = this.roomData.players.filter(players => { return players.name != '' });
        this.storyTeller = this.roomData.players.find(players => { return players.storyteller == true });
        this.cards = this.shuffle(this.roomData.selectedCards);
        this.host = this.roomData.players.find(players => { return players.host == true && players.uid == this.uid.toString() });
        this.hostname = this.roomData.players.find(players => { return players.host == true });
        this.story = this.roomData.story;

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
        this.winnerBtn = false;
        if (Object.keys(this.winner).length > 0) {
          this.winnerBtn = true;
        }

        if (this.roomData.winner) {
          this.router.navigate(['/room/'+room+'/winner']);
        }

        if (Object.keys(this.players).length < 3) {
          this.modalsService.open('leave');
        }

        this.nextRoundBtn = false;
        if (this.route.snapshot.params['round'] < this.roomData.round) {
          const playersReady = this.roomData.players.filter(players => { return players.roundFinished == true });

          if (Object.keys(playersReady).length == 0) {
            this.nextRoundBtn = true;
          }
        }

        // this.leaderboard = Array(31);
      }
    );
  }

  nextRound() {
    if (this.winnerBtn) {
      this.dataStorage.updateRoom({ ...this.roomData, winner: true }, 'We have a winner!');
    } else {
      this.resetData();
      this.dataStorage.updateRoom({ ...this.roomData, nextRound: true }, 'Round '+this.roomData.round+' is starting.');
    }
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

  nextRoundRedirect() {
    this.router.navigate(['/room/'+this.roomData.key+'/round/'+this.roomData.round]);
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

    this.myChoice = card.value.card;

    this.dataStorage.updateRoom({ ...this.roomData}, 'Finishing round');
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
    this.myPoints = '';

    for (let key in this.roomData.selectedCards) {
      if (this.roomData.selectedCards[key]['choosenBy'] !== undefined) {

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
          if (this.roomData.selectedCards[listeners[k]]['choosenBy'][contributor].uid == this.uid) continue;

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
    this.dataStorage.updateRoom({ ...this.roomData }, 'Setting points');
  }

  private resetData() {
    // move to the next storyteller
    let storyTellerIndex = +Object.keys(this.roomData.players).find(key => this.roomData.players[key] === this.storyTeller);
    this.roomData.players[storyTellerIndex].storyteller = false;

    this.nextStoryTeller(++storyTellerIndex);

    delete this.roomData.story;

    this.roomData.selectedCards = {};

    // add new card to each player
    if (this.roomData.round > 1) {
      for (let player in this.players) {
        if (this.players[player].roundFinished != undefined) {
          this.players[player].roundFinished = false;
        }

        if (Object.keys(this.roomData.remainingCards).length > 0) {
          let randomNumber = Math.floor(Math.random() * (Object.keys(this.roomData.remainingCards).length - 0 + 1)) + 0;
          if (Object.keys(this.roomData.remainingCards).length < Object.keys(this.players).length) {
            randomNumber = 0;
          }

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
    }

    this.dataStorage.updateRoom({ ...this.roomData }, 'Reset data');
  }

  nextStoryTeller(index) {
    if (index == Object.keys(this.roomData.players).length) {
      index = 0;
    }

    if (this.roomData.players[index].name !== '') {
      this.roomData.players[index].storyteller = true;
      return index;
    }
    return this.nextStoryTeller(++index);
  }

  @HostListener('window:beforeunload')
  canDeactivate (): Observable<boolean> | Promise<boolean> | boolean {
    return confirm('Are you sure you want to leave?');
  }
}
