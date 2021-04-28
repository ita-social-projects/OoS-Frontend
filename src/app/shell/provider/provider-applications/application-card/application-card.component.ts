import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Application } from 'src/app/shared/models/application.model';

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

  /**
   * This method get of the child
   * @param string birth date
  * @returns number Age
  */
  getAge(dateString: string): number {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
  * This method emit on approve action
  * @param Application application
  */
  onApprove(application: Application): void {
    this.approved.emit(application);
  }

  /**
  * This method emit on deny action
  * @param Application application
  */
  onDeny(application: Application): void {
    this.denied.emit(application);
  }

  /**
  * This method emit on mouseover action on child avatar
  * @param Application application
  */
  onInfoShow(element: Element): void {
    this.infoShow.emit({ element, child: this.application.child });
  }

  /**
  * This method emit on mouseleave action on child avatar
  * @param Application application
  */
  onInfoHide(element: Element): void {
    this.infoHide.emit();
  }
}