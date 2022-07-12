import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  CreateProviderSteps,
  InstitutionTypes,
  OwnershipType,
  OwnershipTypeUkr,
  ProviderType,
  ProviderTypeUkr,
} from '../../enum/provider';
import { Provider } from '../../models/provider.model';
import { Select, Store } from '@ngxs/store';
import { MetaDataState } from '../../store/meta-data.state';
import { Observable, Subject } from 'rxjs';
import { InstitutionStatus } from '../../models/institutionStatus.model';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';
import { GetInstitutionStatus } from '../../store/meta-data.actions';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-provider-info',
  templateUrl: './provider-info.component.html',
  styleUrls: ['./provider-info.component.scss'],
})
export class ProviderInfoComponent implements OnInit {
  readonly constants: typeof Constants = Constants;
  readonly providerType: typeof ProviderType = ProviderType;
  readonly ownershipType: typeof OwnershipType = OwnershipType;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;
  readonly institutionTypes = InstitutionTypes;

  editLink: string = CreateProviderSteps[0];

  @Input() provider: Provider;
  @Input() isProviderView: boolean;

  @Output() tabChanged = new EventEmitter();
  @Output() closeInfo = new EventEmitter();

  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  institutionStatusName: string;

  destroy$: Subject<boolean> = new Subject<boolean>();
  

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatus());
    this.institutionStatuses$.pipe(takeUntil(this.destroy$),filter((institutionStatuses: InstitutionStatus[])=>(!!institutionStatuses)))
      .subscribe((institutionStatuses: InstitutionStatus[]) => {
       this.institutionStatusName = institutionStatuses.find((item: InstitutionStatus)=>(item.id === this.provider.institutionStatusId)).name;
      })
  }

  onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.editLink = CreateProviderSteps[tabChangeEvent.index];
    this.tabChanged.emit(tabChangeEvent);
  }

  onCloseInfo(): void {
    this.closeInfo.emit();
  }

  onActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }
}
