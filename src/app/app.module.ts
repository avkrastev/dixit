import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';
import { StartComponent } from './start/start.component';
import { NameModalComponent } from './modals/name-modal/name-modal.component';
import { RoomModalComponent } from './modals/room-modal/room-modal.component';
import { PlayersComponent } from './room/players/players.component';
import { PlayerComponent } from './room/players/player/player.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { GameComponent } from './room/game/game.component';
import { HeaderComponent } from './header/header.component';
import { TellStoryComponent } from './modals/tell-story/tell-story.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { RoundComponent } from './room/game/round/round.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    StartComponent,
    PlayersComponent,
    PlayerComponent,
    GameComponent,
    HeaderComponent,
    TellStoryComponent,
    ConfirmComponent,
    RoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NameModalComponent,
    RoomModalComponent,
],
})
export class AppModule { }
