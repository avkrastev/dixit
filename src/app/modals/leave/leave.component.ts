import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/data-storage.service';
import { ModalsService } from 'src/app/modals.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['../modals.component.scss','./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  @ViewChild('close') close;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private dataStore: DataStorageService,
    private modalsService: ModalsService,
  ) { }

  ngOnInit(): void {
  }

  leaveRoom() {
    let currentURL = this.router.url.split('/');
    let roomParamIndex = currentURL.findIndex(element => {return element == 'room'});

    if (typeof roomParamIndex != 'undefined') {
      this.dataStore.deleteRoom(currentURL[++roomParamIndex]);
      this.modalsService.leaveRoute.next(true);
      this.router.navigate(['/']);
    }
  }

}
