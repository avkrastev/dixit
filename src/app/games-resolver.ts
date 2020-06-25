import { Injectable } from "@angular/core";
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";

import { DataStorageService } from './data-storage.service';
import { NewGameService } from 'src/app/new-game.service';
import { Room } from './models/room.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GamesResolverService implements Resolve<Room[]> {
    constructor(
        private dataStorageService: DataStorageService,
        private newGameService: NewGameService
    ){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        return this.dataStorageService.getRoom(route.params['key']).subscribe();
        /*const players = this.newGameService.getPlayersPerRoom();

        if (players.length === 0) {
            return this.dataStorageService.fetchRoom(route.params['key']);
        } else {
            return players;
        }*/
    }
}
