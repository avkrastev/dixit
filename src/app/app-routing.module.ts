import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { StartComponent } from './start/start.component';
import { GamesResolverService } from './games-resolver';

const routes: Routes = [
  { path: '', component: StartComponent, pathMatch: 'full' },
  { path: 'room/:key', component: RoomComponent, resolve: [GamesResolverService] },
  { path: '**', redirectTo: 'rooms/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
