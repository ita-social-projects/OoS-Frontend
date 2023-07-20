import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import {
  ConfirmationModalWindowComponent
} from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Application } from 'shared/models/application.model';
import { Child, ChildrenParameters } from 'shared/models/child.model';
import { ParentWithContactInfo } from 'shared/models/parent.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop } from 'shared/models/workshop.model';
import {
  NavigationBarService
} from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';
import {
  CreateApplication, GetStatusIsAllowToApply, GetUsersChildren
} from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { RegistrationState } from 'shared/store/registration.state';
import { GetWorkshopById, ResetProviderWorkshopDetails } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';

@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit, OnDestroy {
  public readonly ModeConstants = ModeConstants;

  @Select(ParentState.children)
  private children$: Observable<SearchResponse<Child[]>>;
  public children: Child[];
  @Select(ParentState.isAllowChildToApply)
  private isAllowChildToApply$: Observable<boolean>;
  public isAllowChildToApply: boolean;
  @Select(RegistrationState.parent)
  private parent$: Observable<ParentWithContactInfo>;
  public parent: ParentWithContactInfo;
  @Select(SharedUserState.selectedWorkshop)
  private workshop$: Observable<Workshop>;
  public workshop: Workshop;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private tabIndex = 0;
  private childrenParameters: ChildrenParameters = {
    searchString: '',
    isParent: null,
    isGetParent: true,
    from: 0,
    size: 0
  };

  public ContraindicationAgreementFormControl = new FormControl(false);
  public ParentAgreementFormControl = new FormControl(false);
  public AttendAgreementFormControl = new FormControl(false);
  public ContraindicationAgreementFormControlYourself = new FormControl(false);
  public AttendAgreementFormControlYourself = new FormControl(false);
  public ChildFormControl = new FormControl('', Validators.required);

  public parentCard: Child;
  public selectedChild: Child;
  public isContraindicationAgreed: boolean;
  public isAttendAgreed: boolean;
  public isParentAgreed: boolean;
  public isContraindicationAgreementYourself: boolean;
  public isAttendAgreementYourself: boolean;
  public workshopId: string;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    public navigationBarService: NavigationBarService
  ) {
    this.workshopId = this.route.snapshot.paramMap.get('id');
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetWorkshopById(this.workshopId));
    this.ParentAgreementFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isParentAgreed = val));
    this.AttendAgreementFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isAttendAgreed = val));
    this.ContraindicationAgreementFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => (this.isContraindicationAgreed = val));
    this.ContraindicationAgreementFormControlYourself.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => (this.isContraindicationAgreementYourself = val));
    this.AttendAgreementFormControlYourself.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => (this.isAttendAgreementYourself = val));
    this.isAllowChildToApply$.pipe(takeUntil(this.destroy$)).subscribe((status: boolean) => (this.isAllowChildToApply = status));

    this.children$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((children: SearchResponse<Child[]>) => {
      this.parentCard = children.entities.find((child: Child) => child.isParent);
      this.children = children.entities.filter((child: Child) => !child.isParent);
    });

    combineLatest([this.parent$, this.workshop$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([parent, workshop]) => !!(parent && workshop))
      )
      .subscribe(([parent, workshop]) => {
        this.parent = parent;
        this.workshop = workshop;
        this.store.dispatch([
          new GetUsersChildren(this.childrenParameters),
          new AddNavPath(
            this.navigationBarService.createNavPaths(
              {
                name: `Гурток "${this.workshop.title}"`,
                path: `/details/workshop/${this.workshop.id}`,
                isActive: false,
                disable: false
              },
              { name: NavBarName.RequestOnWorkshop, isActive: false, disable: true }
            )
          )
        ]);
      });
  }

  /**
   * This method create new Application
   */
  public onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.createApplication,
        property: this.workshop.title
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const application = new Application(this.tabIndex ? this.parentCard : this.selectedChild, this.workshop, this.parent);
        this.store.dispatch(new CreateApplication(application));
      }
    });
  }

  public onSelectChild(child: MatSelectChange): void {
    this.store.dispatch(new GetStatusIsAllowToApply(child.value.id, this.workshopId));
  }

  public onTabChange(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    if (this.tabIndex) {
      this.store.dispatch(new GetStatusIsAllowToApply(this.parentCard.id, this.workshopId));
    }
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetProviderWorkshopDetails()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
