import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { StartComponent } from './start/start.component';
import { GameComponent } from './room/game/game.component';
import { RoundComponent } from './room/game/round/round.component';

const routes: Routes = [
  { path: '', component: StartComponent, pathMatch: 'full' },
  { path: 'room/:key', component: RoomComponent },
  { path: 'room/:key/round/:round', component: GameComponent },
  { path: 'room/:key/round/:round/finish', component: RoundComponent },
  { path: '**', redirectTo: 'room/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
