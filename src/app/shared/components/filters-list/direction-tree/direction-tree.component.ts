import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { filter, Observable, takeUntil, Subject, map } from 'rxjs';
import { WORD_SPLIT_REGEX } from 'shared/constants/regex-constants';
import { Direction, DirectionNode, DirectionsSelected, Subdirection } from 'shared/models/category.model';
import { DirectionsService } from 'shared/services/directions/directions.service';
import { SetSubdirections, SetDirections, SetIndeterminates, FilterClear } from 'shared/store/filter.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { arraysEqualByValue } from 'shared/utils/utils';

@Component({
  selector: 'app-direction-tree',
  templateUrl: './direction-tree.component.html',
  styleUrls: ['./direction-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectionTreeComponent implements OnDestroy, OnInit {
  @Input()
  public initialDirectionIds: DirectionsSelected;

  @Select(MetaDataState.directions)
  private directions$: Observable<Direction[]>;

  public initDirectionIds: number[] = [];
  public initIndeterminateIds: number[] = [];

  public treeControl = new NestedTreeControl<DirectionNode>((node) => node.children);
  public dataSource = new MatTreeNestedDataSource<DirectionNode>();

  private allDirections: DirectionNode[] = [];
  private originalDirections: DirectionNode[] = [];
  private selectedDirectionIds: number[] = [];
  private indeterminateDirectionIds: number[] = [];
  private selectedSubdirectionIds: number[] = [];

  private loadingChildren: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  private _searchInput: string = '';

  constructor(
    private readonly directionsService: DirectionsService,
    private readonly actions$: Actions,
    private readonly store: Store
  ) {}

  @Input()
  public get searchInput(): string {
    return this._searchInput;
  }
  public set searchInput(value: string) {
    this._searchInput = value;
    if (this.originalDirections.length) {
      this.applyFilter();
    }
  }

  public ngOnInit(): void {
    this.directions$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((directions: Direction[]) => {
      this.originalDirections = this.transformDirections(directions);
      this.applyFilter();
      this.selectInitialIds(this.initialDirectionIds);
    });

    this.actions$.pipe(ofActionSuccessful(FilterClear), takeUntil(this.destroy$)).subscribe(() => {
      this.selectedDirectionIds = [];
      this.selectedSubdirectionIds = [];
      this.indeterminateDirectionIds = [];
      this.initDirectionIds = [];
      this.initIndeterminateIds = [];
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method transform directions to tree data
   * @param directions
   * @returns DirectionNode[]
   */
  public transformDirections(directions: Direction[]): DirectionNode[] {
    return directions.map((direction: Direction) => ({
      id: direction.id,
      title: direction.title,
      description: direction.description,
      children: direction.subdirections
        ? direction.subdirections.map((sub: Subdirection) => ({
            id: sub.id,
            title: sub.title,
            description: sub.description
          }))
        : []
    }));
  }

  public hasChild = (_: number, node: DirectionNode): boolean => !!node.children;

  public onToggle(node: DirectionNode): void {
    if (node?.children.length === 0) {
      this.loadChildren(node);
    } else {
      this.dataSource.data = [];
      this.dataSource.data = this.allDirections;
    }
  }

  public onDirectionCheck(direction: DirectionNode, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedDirectionIds.push(direction.id);
      this.store.dispatch(new SetDirections(this.selectedDirectionIds));

      this.loadChildrenAndPush(direction);
    } else {
      // unchecked
      this.removeDirectionAndChildren(direction);
    }
  }

  public onSubdirectionCheck(subdirection: DirectionNode, event: MatCheckboxChange): void {
    if (event.checked) {
      // checked
      this.selectedSubdirectionIds.push(subdirection.id);
    } else {
      // unchecked
      this.selectedSubdirectionIds = this.selectedSubdirectionIds.filter((id: number) => id !== subdirection.id);
    }
    this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
  }

  public directionChecked(direction: DirectionNode): boolean {
    if (this.initDirectionIds.includes(direction.id)) {
      return true;
    }

    // check if all children are selected
    const allChildrenSelected =
      direction.children.length > 0 && direction.children.every((sub: DirectionNode) => this.selectedSubdirectionIds.includes(sub.id));

    if (allChildrenSelected && !this.selectedDirectionIds.includes(direction.id)) {
      this.selectedDirectionIds.push(direction.id);
      this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    } else if (!allChildrenSelected && this.selectedDirectionIds.includes(direction.id) && !this.loadingChildren) {
      this.selectedDirectionIds = this.selectedDirectionIds.filter((id: number) => id !== direction.id);
      this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    }
    return allChildrenSelected;
  }

  public subdirectionChecked(subdirection: DirectionNode): boolean {
    return this.selectedSubdirectionIds.includes(subdirection.id);
  }

  public isDirectionIndeterminate(direction: DirectionNode): boolean {
    // the direction is indeterminate in the initial state
    if (this.initIndeterminateIds.includes(direction.id)) {
      return true;
    }

    let newIndeterminateIds = [...this.indeterminateDirectionIds];

    // the direction has no children
    if (!direction.children || !direction.children.length) {
      newIndeterminateIds = newIndeterminateIds.filter((id: number) => id !== direction.id);
      // if the indeterminate ids are different, update the store
      if (!arraysEqualByValue(newIndeterminateIds, this.indeterminateDirectionIds)) {
        this.indeterminateDirectionIds = newIndeterminateIds;
        this.store.dispatch(new SetIndeterminates(this.indeterminateDirectionIds));
      }
      return false;
    }
    // count and compare
    const numSelected: number = direction.children.filter((sub: DirectionNode) => this.selectedSubdirectionIds.includes(sub.id)).length;
    const isIndeterminate: boolean = numSelected > 0 && numSelected < direction.children.length;

    // the direction is indeterminate
    if (isIndeterminate && !newIndeterminateIds.includes(direction.id)) {
      newIndeterminateIds.push(direction.id);
    }
    // the direction is not indeterminate
    if (!isIndeterminate) {
      newIndeterminateIds = newIndeterminateIds.filter((id: number) => id !== direction.id);
    }
    // if the indeterminate ids are different, update the store
    if (!arraysEqualByValue(newIndeterminateIds, this.indeterminateDirectionIds)) {
      this.indeterminateDirectionIds = newIndeterminateIds;
      this.store.dispatch(new SetIndeterminates(this.indeterminateDirectionIds));
    }
    return isIndeterminate;
  }

  private loadChildren(node: DirectionNode): void {
    this.directionsService
      .getSubdirections(node.id)
      .pipe(
        map((response) => response.entities),
        takeUntil(this.destroy$)
      )
      .subscribe((subs: Subdirection[]) => {
        node.children = subs as DirectionNode[];
        this.dataSource.data = [];
        this.dataSource.data = this.allDirections;

        // remove from initial ids if it was there
        this.initDirectionIds = this.initDirectionIds.filter((id: number) => id !== node.id);
        this.initIndeterminateIds = this.initIndeterminateIds.filter((id: number) => id !== node.id);
      });
  }

  private loadChildrenAndPush(node: DirectionNode): void {
    this.loadingChildren = true;
    if (node.children.length) {
      // subdirections already fetched
      node.children.forEach((sub) => {
        this.selectedSubdirectionIds.push(sub.id);
      });
      this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
      this.loadingChildren = false;
    } else {
      // fetch subdirections from backend
      this.directionsService
        .getSubdirections(node.id)
        .pipe(
          map((response) => response.entities),
          takeUntil(this.destroy$)
        )
        .subscribe((subs: Subdirection[]) => {
          node.children = subs as DirectionNode[];
          subs.forEach((sub) => {
            this.selectedSubdirectionIds.push(sub.id);
          });
          this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
          this.loadingChildren = false;
        });
    }
  }

  private removeDirectionAndChildren(direction: DirectionNode): void {
    // remove parent's id
    this.selectedDirectionIds = this.selectedDirectionIds.filter((id: number) => id !== direction.id);
    this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    // remove all children ids
    if (direction.children && direction.children.length > 0) {
      direction.children.forEach((sub: Subdirection) => {
        this.selectedSubdirectionIds = this.selectedSubdirectionIds.filter((id: number) => id !== sub.id);
      });
      this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
    }
  }

  private applyFilter(): void {
    if (!this.searchInput || !this.searchInput.trim()) {
      // show all directions if no filter
      this.allDirections = [...this.originalDirections];
    } else {
      // apply search filter
      this.allDirections = this.originalDirections.filter((direction: DirectionNode) => {
        const directionMatches = direction.title
          .toLowerCase()
          .split(WORD_SPLIT_REGEX)
          .some((word) => word.startsWith(this.searchInput.toLowerCase()));

        return directionMatches;
      });
    }
    this.dataSource.data = this.allDirections;
  }

  private selectInitialIds(initials: DirectionsSelected): void {
    const initialDirs = initials.selectedDirectionIds || [];
    const initialSubs = initials.selectedSubdirectionIds || [];
    const initialIndets = initials.indeterminateDirectionIds || [];

    this.initDirectionIds = [...initialDirs];
    this.initIndeterminateIds = [...initialIndets];

    this.selectedDirectionIds = [...initialDirs];
    this.selectedSubdirectionIds = [...initialSubs];
    this.indeterminateDirectionIds = [...initialIndets];

    this.initDirectionIds.forEach((id: number) => {
      const direction = this.allDirections.find((dir) => dir.id === id);
      if (direction) {
        this.loadChildren(direction);
      }
    });

    this.initIndeterminateIds.forEach((id: number) => {
      const direction = this.allDirections.find((dir) => dir.id === id);
      if (direction) {
        this.loadChildren(direction);
      }
    });
  }
}
