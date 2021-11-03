import { Component, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { createProviderSteps, OwnershipType, OwnershipTypeUkr, ProviderType, ProviderTypeUkr } from 'src/app/shared/enum/provider';
import { InstitutionStatus } from 'src/app/shared/models/institutionStatus.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';
import { GetInstitutionStatus } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss']
})
export class ProviderOrgInfoComponent implements OnInit {

  readonly providerType: typeof ProviderType = ProviderType;
  readonly ownershipType: typeof OwnershipType = OwnershipType;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;
  readonly createProviderSteps = createProviderSteps;

  editLink: string = createProviderSteps[0];

  @Select(RegistrationState.provider) provider$: Observable<Provider>;
  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() editMode: boolean;
  @Input() provider: Provider;
  // m: number
  currentStatus: string;

  constructor(private store: Store) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  

  ngOnInit(): void { 
    this.store.dispatch(new GetInstitutionStatus())
    this.institutionStatuses$
    .pipe(
      takeUntil(this.destroy$),
    ).subscribe((institutionStatuses: InstitutionStatus[]) => {
      // this.store.dispatch(new GetInstitutionStatus())
      // debugger
      if (institutionStatuses.length) {
        debugger
        // const m = institutionStatuses.find((item, index) => {+item.id === this.provider.institutionStatusId}) 
        const m = institutionStatuses.find(({id}) => +id === this.provider.institutionStatusId) 

        // console.log(m)
        this.currentStatus = m.name.toString()
        // console.log(this.b)
        
      }; 
    }); 
  } 

  ActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink = createProviderSteps[tabChangeEvent.index];
  }

}
