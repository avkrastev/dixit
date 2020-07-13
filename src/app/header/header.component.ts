import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NewGameService } from '../new-game.service';
import { DataStorageService } from '../data-storage.service';
import { ModalsService } from '../modals.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  navbarCollapsed: boolean = true;
  leaveGameSub: Subscription;
  gameIsStarted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
    private modalsService: ModalsService
  )
  { }

  ngOnInit(): void {
  }

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  leaveGame(logout = false) {
    const room = this.route.snapshot.params['key'];

    const uid = JSON.parse(localStorage.getItem('uid'));

    if (typeof room == 'undefined' || room == 404) {
      if (logout) {
        this.newGameService.removeUsername();
      }
      this.router.navigate(['/']);
      return;
    }

    this.leaveGameSub = this.dataStorage.fetchRoom(room).subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.router.navigate(['/']);
          return;
        }

        const roomData = Object.assign({}, ...data);

        const playerToRemove = roomData.players.find(players => { return players.uid == uid.toString() });

        this.gameIsStarted = roomData.gameStarted;
        if (this.gameIsStarted) {
          this.router.navigate(['/'], {state: {playerToRemove: playerToRemove, roomData: roomData, logout: logout}});
          return;
        }

        if (typeof playerToRemove != 'undefined') {
          this.dataStorage.removePlayerFromRoom(playerToRemove, roomData, logout);
        }
      }
    );
  }

  rules() {
    this.modalsService.open('rules');
  }

  ngOnDestroy() {
    if (this.leaveGameSub) {
      this.leaveGameSub.unsubscribe();
    }
  }

}
