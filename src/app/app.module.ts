import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';
import { StartComponent } from './start/start.component';
import { NameModalComponent } from './modals/name-modal/name-modal.component';
import { RoomModalComponent } from './modals/room-modal/room-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    StartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NameModalComponent,
    RoomModalComponent,
],
})
export class AppModule { }
