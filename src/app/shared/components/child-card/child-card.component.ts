// import { Application } from 'src/app/shared/models/application.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CabinetDataComponent } from 'src/app/shell/personal-cabinet/cabinet-data/cabinet-data.component';
import { Role } from '../../enum/role';
import { Application } from '../../models/application.model';
import { Child } from '../../models/child.model';
import { Workshop } from '../../models/workshop.model';
import { DeleteChildById } from '../../store/user.actions';
import { UserState } from '../../store/user.state';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent  implements OnInit {

  @Input() child: Child;
  @Input() applications:Array<Application>;
  @Output() deleteChild = new EventEmitter<Child>();


  ngOnInit(): void {}

  onDelete(): void {
    this.deleteChild.emit(this.child);
  }

}
