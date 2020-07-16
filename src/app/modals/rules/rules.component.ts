import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['../modals.component.scss', './rules.component.scss'],
})
export class RulesComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}
