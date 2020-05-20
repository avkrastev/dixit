import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class NewGameService {

  constructor(private router: Router) {}

  storeName(username) {
    localStorage.setItem('username', JSON.stringify(username));
  }

  removeUsername() {
    this.router.navigate(['/']);
    localStorage.removeItem('username');
  }
}
