import { GetSupportInfoPortal } from './../../../../shared/store/admin.actions';
import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { AdminState } from 'src/app/shared/store/admin.state';

@Component({
  selector: 'app-support-platform',
  templateUrl: './support-platform.component.html',
  styleUrls: ['./support-platform.component.scss']
})
export class SupportPlatformComponent implements OnInit {
  @Select(AdminState.supportPortal)
  supportPortal$: Observable<CompanyInformation>
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }
  
  ngOnInit(): void {
    this.store.dispatch(new GetSupportInfoPortal());
  }

}
