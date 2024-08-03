import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// eslint-disable-next-line max-len
import { UnregisteredUserWarningModalComponent } from 'shared/components/unregistered-user-warning-modal/unregistered-user-warning-modal.component';
import { ModeConstants } from 'shared/constants/constants';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { PayRateTypeEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationDescription } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { WorkshopOpenStatus } from 'shared/enum/workshop';
import { Favorite } from 'shared/models/favorite.model';
import { Workshop } from 'shared/models/workshop.model';
import { ShowMessageBar } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { RegistrationState } from 'shared/store/registration.state';
import { ProviderState } from 'shared/store/provider.state';
import { BlockedParent } from 'shared/models/block.model';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Parent } from 'shared/models/parent.model';
import { Provider } from 'shared/models/provider.model';
import { GetBlockedParents } from 'shared/store/provider.actions';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  @Input()
  public workshop: Workshop;
  @Input()
  public role: string;

  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;
  @Select(RegistrationState.parent)
  private parent$: Observable<Parent>;
  @Select(SharedUserState.selectedProvider)
  private selectedProvider$: Observable<Provider>;
  @Select(RegistrationState.role)
  private role$: Observable<string>;
  @Select(ParentState.favoriteWorkshops)
  private favoriteWorkshops$: Observable<Favorite[]>;
  @Select(ProviderState.blockedParent)
  private isBlocked$: Observable<BlockedParent>;

  public readonly ModalTypeAction = ModalConfirmationDescription;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly ModeConstants = ModeConstants;
  public readonly Role = Role;

  public favoriteWorkshop: Favorite;
  public isFavorite: boolean;
  public hideApplicationSubmission: boolean;
  public isBlocked: boolean;
  public parentId: string;
  public selectedProviderId: string;

  private readonly workshopStatus = WorkshopOpenStatus;
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.hideApplicationSubmission = this.workshop.status === this.workshopStatus.Closed;
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role) => (this.role = role));
    combineLatest([
      this.parent$.pipe(filter(Boolean), takeUntil(this.destroy$)),
      this.selectedProvider$.pipe(takeUntil(this.destroy$))
    ]).subscribe(([parent, provider]) => {
      this.parentId = parent.id;
      this.selectedProviderId = provider.id;

      if (this.parentId) {
        this.store.dispatch(new GetBlockedParents(this.selectedProviderId, this.parentId));
      }
    });
    this.isBlocked$.pipe(takeUntil(this.destroy$)).subscribe((blockedParent) => (this.isBlocked = blockedParent !== null));
    combineLatest([this.favoriteWorkshops$, this.route.params])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([favorites, params]) => {
        this.favoriteWorkshop = favorites?.find((item) => item.workshopId === params.id);
        this.isFavorite = !!this.favoriteWorkshop;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onOpenDialog(type: ModalConfirmationDescription): void {
    const isRegistered = this.store.selectSnapshot(RegistrationState.isRegistered);
    if (this.role === Role.unauthorized || !isRegistered) {
      this.dialog.open(UnregisteredUserWarningModalComponent, {
        autoFocus: false,
        restoreFocus: false,
        data: {
          message: type
        }
      });
    } else if (this.isBlocked) {
      this.store.dispatch(
        new ShowMessageBar({
          message: SnackbarText.accessIsRestricted,
          type: 'error',
          info: SnackbarText.accessIsRestrictedFullDescription
        })
      );
    } else if (type === this.ModalTypeAction.unregisteredApplicationWarning) {
      this.router.navigate(['/create-application', this.workshop.id]);
    } else {
      this.router.navigate(['/personal-cabinet/messages/', this.workshop.id], { queryParams: { mode: ModeConstants.WORKSHOP } });
    }
  }

  public onDislike(): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(this.favoriteWorkshop.id),
      new ShowMessageBar({ message: SnackbarText.deleteWorkshopFavorite, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  public onLike(): void {
    const param = new Favorite(
      this.route.snapshot.paramMap.get('id'),
      this.store.selectSnapshot(RegistrationState.parent).userId.toString()
    );
    this.store.dispatch([
      new CreateFavoriteWorkshop(param),
      new ShowMessageBar({ message: SnackbarText.addedWorkshopFavorite, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }
}
