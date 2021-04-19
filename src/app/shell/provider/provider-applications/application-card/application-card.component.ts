import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-request-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})

export class ApplicationCardComponent implements OnInit {

  constructor() { }

  @Input() card;
  @Output() approved = new EventEmitter();
  @Output() denied = new EventEmitter();

  ngOnInit(): void {
  }

  getAge(dateString: string) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  onApprove(card): void {
    this.approved.emit(card);
  }
  onDeny(card): void {
    this.denied.emit(card);
  }

}