import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationIcons, ApplicationStatus } from '../../../../../shared/enum/applications';
import { ApplicationStatusDescription, ApplicationTitles } from '../../../../../shared/enum/enumUA/applications';
import { Application } from '../../../../../shared/models/application.model';
import { BlockedParent } from '../../../../../shared/models/block.model';
import { Provider } from '../../../../../shared/models/provider.model';
import { RegistrationState } from '../../../../../shared/store/registration.state';
import { GetBlockedParents, OnClearBlockedParents } from '../../../../../shared/store/user.actions';
import { UserState } from '../../../../../shared/store/user.state';

@Component({
  selector: 'app-info-status',
  templateUrl: './info-status.component.html',
  styleUrls: ['./info-status.component.scss']
})
export class InfoStatusComponent implements OnInit, OnDestroy{

  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatusDescription = ApplicationStatusDescription;
  readonly applicationIcons = ApplicationIcons;
  readonly applicationStatus = ApplicationStatus;

  @Select(UserState.blockedParent)
  blockedParent$: Observable<BlockedParent>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() application: Application = null;
  status: ApplicationStatus;
  reason: string;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.status =  this.application.isBlocked ? ApplicationStatus.Blocked : ApplicationStatus[this.application.status];
    this.reason =  !this.application.isBlocked && this.application.rejectionMessage;
  }

  onGetBlockedParent(): void {
    if(this.application.isBlocked){
      const providerId = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
      this.store.dispatch(new GetBlockedParents(providerId,this.application.parentId));
      this.blockedParent$
        .pipe(takeUntil(this.destroy$),
        filter((blockedParent:BlockedParent)=>!!blockedParent))
        .subscribe((blockedParent:BlockedParent)=>{
        this.reason =  blockedParent.reason;
      });
    }
  }

  onMenuClosed(): void {
    if(this.application.isBlocked){
      this.store.dispatch(new OnClearBlockedParents())
    }
  }

ngOnDestroy(): void{
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
  }
}
