import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'room/:key', component: RoomComponent },
  { path: '**', redirectTo: 'room/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
