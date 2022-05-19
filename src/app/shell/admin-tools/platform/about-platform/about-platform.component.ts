import { Select, Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { GetInfoAboutPortal } from 'src/app/shared/store/admin.actions';
import { Observable, Subject } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';

@Component({
  selector: 'app-about-platform',
  templateUrl: './about-platform.component.html',
  styleUrls: ['./about-platform.component.scss']
})
export class AboutPlatformComponent implements OnInit {
  @Select(AdminState.aboutPortal)
  aboutPortal$: Observable<CompanyInformation>
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }
  
  ngOnInit(): void {
    this.store.dispatch(new GetInfoAboutPortal());
  }
}
