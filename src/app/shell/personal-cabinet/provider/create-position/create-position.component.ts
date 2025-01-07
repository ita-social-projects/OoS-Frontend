import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Position } from 'shared/models/position.model';
import { Provider } from 'shared/models/provider.model';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { CreatePosition, GetPositionById, UpdatePosition } from 'shared/store/provider.actions';
import { Observable, takeUntil, filter, take, tap } from 'rxjs';
import { ProviderState } from 'shared/store/provider.state';
import { FormGroup } from '@angular/forms';
import { Constants } from 'shared/constants/constants';
import { AddNavPath } from 'shared/store/navigation.actions';
import { Role, Subrole } from 'shared/enum/role';
import { Util } from 'shared/utils/utils';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { RegistrationState } from 'shared/store/registration.state';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-position',
  templateUrl: './create-position.component.html',
  styleUrls: ['./create-position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePositionComponent extends CreateFormComponent implements AfterContentChecked, OnInit {
  @Select(ProviderState.selectedPosition)
  public selectedPosition$: Observable<Position>;

  @Select(RegistrationState.provider)
  public provider$: Observable<Provider>;
  public position: Position;
  public provider: Provider;
  public PositionFormGroup: FormGroup;
  public AddressFormGroup: FormGroup;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly router: Router
  ) {
    super(store, route, navigationBarService);
  }

  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public ngOnInit(): void {
    this.determineEditMode();
    this.determineRelease();
    this.addNavPath();
  }

  public setEditMode(): void {
    const positionId = this.route.snapshot.paramMap.get('param');

    this.provider$
      .pipe(
        takeUntil(this.destroy$),
        filter((provider: Provider) => provider != null),
        tap((provider: Provider) => {
          this.provider = provider;
          this.store.dispatch(new GetPositionById(positionId, this.provider.id));
        })
      )
      .subscribe();

    this.selectedPosition$
      .pipe(
        takeUntil(this.destroy$),
        filter((position: Position) => position?.id === positionId),
        tap((position: Position) => {
          this.position = new Position(position, this.provider, positionId);
          this.editMode = true;
        })
      )
      .subscribe();
  }

  public onSubmit(): void {
    const positionInfo = this.createPosition();
    let position: Position;
    if (this.editMode) {
      position = new Position(positionInfo, this.provider, this.position.id);
      this.store.dispatch(new UpdatePosition(position));
    } else {
      position = new Position(positionInfo, this.provider);
      this.store.dispatch(new CreatePosition(position));
    }
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/positions']);
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subrole = this.store.selectSnapshot<Subrole>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subrole);
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/provider/administration',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode ? NavBarName.EditPosition : NavBarName.NewPosition,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public onReceiveAddressFormGroup(form: FormGroup): void {
    this.AddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  public onReceivePositionFormGroup(form: FormGroup): void {
    this.PositionFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  private createPosition(): Position {
    const position = this.PositionFormGroup.getRawValue();
    if (position.availableSeats === null) {
      position.availableSeats = Constants.WORKSHOP_UNLIMITED_SEATS;
    }
    return position;
  }
}
