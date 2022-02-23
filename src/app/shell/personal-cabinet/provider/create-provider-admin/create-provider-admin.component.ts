import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateFormComponent } from '../../create-form/create-form.component';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { CreateProviderAdmin, GetWorkshopsByProviderId } from 'src/app/shared/store/user.actions';
import { ProviderAdmin } from 'src/app/shared/models/providerAdmin.model';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserState } from 'src/app/shared/store/user.state';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';

@Component({
  selector: 'app-create-provider-admin',
  templateUrl: './create-provider-admin.component.html',
  styleUrls: ['./create-provider-admin.component.scss']
})
export class CreateProviderAdminComponent extends CreateFormComponent implements OnInit, OnDestroy {

  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(UserState.workshops)
  workshops$: Observable<WorkshopCard[]>;
  
  provider: Provider;
  ProviderAdminFormGroup: FormGroup;
  readonly constants: typeof Constants = Constants;
  params = this.route.snapshot.paramMap.get('param');
  isDeputy = false;
  managedWorkshopIds: string[];

  constructor(store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,) {
    super(store, route, navigationBarService);

    this.ProviderAdminFormGroup = this.formBuilder.group({
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(Constants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
  
  setEditMode(): void {
    this.addNavPath();
  }

  addNavPath(): void {
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
      { name: NavBarName.PersonalCabinetProvider, path: '/personal-cabinet/provider/info', isActive: false, disable: false },
      { name: NavBarName.CreateProviderAdmin, isActive: false, disable: true }
    )));
  }

  getProvider(): void {
    this.provider$.pipe(
      filter((provider: Provider) => !!provider),
      takeUntil(this.destroy$)
    ).subscribe((provider: Provider) => {
      this.provider = provider;
    });
  }
  getProviderWorkshops(): void {
    this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
  }

  onWorkshopsSelect(workshopsId: string[]): void {
    this.managedWorkshopIds = workshopsId;
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.getProvider();
    this.getProviderWorkshops();
    this.isDeputy = (this.params === 'deputy') ? true : false;
  }

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: (this.isDeputy) ? ModalConfirmationType.createProviderAdminDeputy : ModalConfirmationType.createProviderAdmin
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let providerAdmin = new ProviderAdmin(this.ProviderAdminFormGroup.value, this.provider.id, this.isDeputy, this.managedWorkshopIds)
        this.store.dispatch(new CreateProviderAdmin(providerAdmin));
      }
    });   
  }

}
