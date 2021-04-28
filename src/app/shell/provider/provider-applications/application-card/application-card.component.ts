import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ChildInfoBoxComponent } from 'src/app/shared/components/child-info-box/child-info-box.component';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { ParentState } from 'src/app/shared/store/parent.state';
@Component({
  selector: 'app-request-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})

export class ApplicationCardComponent implements OnInit {

  constructor() { }

  @Input() application: Application;
  @Output() approved = new EventEmitter();
  @Output() denied = new EventEmitter();
  @Output() infoShow = new EventEmitter();
  @Output() infoHide = new EventEmitter();

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
  onApprove(application: Application): void {
    this.approved.emit(application);
  }
  onDeny(application: Application): void {
    this.denied.emit(application);
  }
  onInfoShow(element: Element): void {
    this.infoShow.emit({ element, child: this.application.child });
  }
  onInfoHide(element: Element): void {
    this.infoHide.emit();
  }
}