import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Direction } from 'shared/models/category.model';
import { InstituitionHierarchy } from 'shared/models/institution.model';
import { AppState } from 'shared/store/app.state';
import { SetDirections, SetSubDirections } from 'shared/store/filter.actions';
import { GetAllInstitutionsHierarchy, GetDirections } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss']
})
export class CategoryCheckBoxComponent implements OnInit, OnDestroy {
  @Input()
  public selectedDirectionIds: number[];
  @Input()
  public selectedSubDirectionIds: string[];

  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;
  // TODO: Change to subDirections
  @Select(MetaDataState.instituitionsHierarchyAll)
  private readonly subDirections$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.directions)
  private readonly directions$: Observable<Direction[]>;

  public readonly sportDirectionId = 17;
  public panelOpenState = false;
  public subDirectionPanelOpenState = false;
  public filteredDirections: Direction[] = [];
  public directionSearchFormControl = new FormControl('');
  public allDirections: Direction[] = [];
  public allSubDirections: InstituitionHierarchy[] = [];
  public filteredSubDirections: InstituitionHierarchy[] = [];
  public subDirectionSearchFormControl = new FormControl('');
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetDirections());
    this.directions$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((directions) => {
      this.allDirections = directions;
      this.filteredDirections = directions;
      this.cdr.markForCheck();
    });

    this.store.dispatch(new GetAllInstitutionsHierarchy());
    this.subDirections$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((subDirections) => {
      this.allSubDirections = subDirections;
      this.filteredSubDirections = subDirections;
      this.cdr.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onDirectionCheckChange(changes: { selectedItemsIds: number[]; changedItemId: number }): void {
    const { selectedItemsIds, changedItemId } = changes;
    if (!selectedItemsIds.includes(this.sportDirectionId) && changedItemId === this.sportDirectionId) {
      this.selectedSubDirectionIds = [];
      this.store.dispatch(new SetSubDirections(this.selectedSubDirectionIds));
    }
    this.store.dispatch(new SetDirections(selectedItemsIds));
  }

  public onSubDirectionCheckChange(changes: { selectedItemsIds: string[]; changedItemId: string }): void {
    this.store.dispatch(new SetSubDirections(changes.selectedItemsIds));
  }

  public isSelected(id: number): boolean {
    return this.selectedDirectionIds.includes(id);
  }
}
