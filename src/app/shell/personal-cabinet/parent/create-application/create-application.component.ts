import { NavBarName } from './../../../../shared/enum/navigation-bar';
import { NavigationBarService } from './../../../../shared/services/navigation-bar/navigation-bar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { cardType } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateApplication, GetAllUsersChildren, GetWorkshopById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { ParentWithContactInfo } from 'src/app/shared/models/parent.model';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { takeUntil, filter } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';


@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit, OnDestroy {

  readonly CardType = cardType;

  @Select(UserState.children) children$: Observable<ChildCards>;
  @Select(RegistrationState.user) user$: Observable<User>;
  @Select(RegistrationState.parent) parent$: Observable<ParentWithContactInfo>;
  parent: ParentWithContactInfo;

  ContraindicationAgreementFormControl = new FormControl(false);
  ParentAgreementFormControl = new FormControl(false);
  AttendAgreementFormControl = new FormControl(false);

  selectedChild: Child;
  isContraindicationAgreed: boolean;
  isAttendAgreed: boolean;
  isParentAgreed: boolean;

  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  workshop: Workshop;
  workshopId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ChildFormControl = new FormControl('', Validators.required);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    public navigationBarService: NavigationBarService) { }

  ngOnInit(): void {

    this.ParentAgreementFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.isParentAgreed = val);
    this.AttendAgreementFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.isAttendAgreed = val);
    this.ContraindicationAgreementFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.isContraindicationAgreed = val);

    this.parent$
      .pipe(
        filter((parent: ParentWithContactInfo) => !!parent),
        takeUntil(this.destroy$))
      .subscribe((parent: ParentWithContactInfo) => {
        this.parent = parent;
        this.store.dispatch(new GetAllUsersChildren());
      });

    this.workshopId = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetWorkshopById(this.workshopId));

    this.workshop$
      .pipe(takeUntil(this.destroy$))
      .subscribe((workshop: Workshop) => this.workshop = workshop);

    this.store.dispatch(new AddNavPath(this.navigationBarService.createNavPaths(
      { name: NavBarName.TopWorkshops, path: '/result', isActive: false, disable: false },
      { name: NavBarName.RequestOnWorkshop, isActive: false, disable: true }
    )));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method create new Application
   */
  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.createApplication,
        property: this.workshop.title
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const application = new Application(this.selectedChild, this.workshop, this.parent);
        this.store.dispatch(new CreateApplication(application));
      }
    });
  }
}
