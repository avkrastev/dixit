import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({providedIn: 'root'})
export class NewGameService {
  roomCode:string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  storeName(username) {
    localStorage.setItem('username', JSON.stringify(username));
  }

  removeUsername() {
    this.router.navigate(['/']);
    localStorage.removeItem('username');
  }

  hostNewGame() {
    this.roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.router.navigate(['/room', this.roomCode], { relativeTo: this.route });
  }

  get roomCodeNumber(): string {
    return this.roomCode;
  }
}
