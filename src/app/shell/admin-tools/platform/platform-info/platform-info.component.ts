import { PortalInfoType } from './../../../../shared/enum/portal';
import { Select, Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { GetPortalInfo } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-platform-info-platform',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.scss']
})
export class PlatformInfoComponent implements OnInit {
  @Input() type: PortalInfoType;

  @Select(AdminState.platformInfo)
  aboutPortal$: Observable<CompanyInformation>
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }
  
  ngOnInit(): void {
    this.store.dispatch(new GetPortalInfo(this.type));
  }
}
