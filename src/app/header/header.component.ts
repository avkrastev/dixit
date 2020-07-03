import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NewGameService } from '../new-game.service';
import { DataStorageService } from '../data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  navbarCollapsed:boolean = true;
  leaveGameSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private newGameService: NewGameService,
    private dataStorage: DataStorageService,
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
      this.router.navigate(['/']);
      if (logout) {
        this.newGameService.removeUsername();
      }
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

        if (typeof playerToRemove != 'undefined') {
          const playersLeft = roomData.players.find(players => { return players.name != '' && players.name != playerToRemove.name });
          let method = 'deleteRoom';

          if (typeof playersLeft != 'undefined') {
            if (playerToRemove.host) {
              playersLeft.host = true;
            }
            method = 'updateRoom';
          }

          this.newGameService.resetPlayerFields(playerToRemove);

          if (method == 'updateRoom') {
            const message = 'One player left!';
            this.dataStorage.updateRoom({ ...roomData }, message);
          } else {
            this.dataStorage.deleteRoom(roomData.id);
          }

          if (logout) {
            this.newGameService.removeUsername();
          }
          this.router.navigate(['/']);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.leaveGameSub) {
      this.leaveGameSub.unsubscribe();
    }
  }

}
