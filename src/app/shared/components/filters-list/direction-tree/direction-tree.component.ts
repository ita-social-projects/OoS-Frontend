import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, takeUntil, Subject, map } from 'rxjs';
import { Direction, DirectionNode, DirectionsSelected, Subdirection } from 'shared/models/category.model';
import { DirectionsService } from 'shared/services/directions/directions.service';
import { SetSubdirections, SetDirections, SetIndeterminates } from 'shared/store/filter.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-direction-tree',
  templateUrl: './direction-tree.component.html',
  styleUrls: ['./direction-tree.component.scss']
})
export class DirectionTreeComponent implements OnDestroy, OnInit {
  @Input()
  public initialDirectionIds: DirectionsSelected;

  @Select(MetaDataState.directions)
  private directions$: Observable<Direction[]>;

  public initDirectionIds: number[] = [];
  public initSubdirectionIds: number[] = [];
  public initIndeterminateIds: number[] = [];

  public treeControl = new NestedTreeControl<DirectionNode>((node) => node.children);
  public dataSource = new MatTreeNestedDataSource<DirectionNode>();

  private allDirections: DirectionNode[] = [];
  private selectedDirectionIds: number[] = [];
  private indeterminateDirectionIds: number[] = [];
  private selectedSubdirectionIds: number[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly directionsService: DirectionsService,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.directions$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((directions: Direction[]) => {
      // update data source when directions are received
      this.allDirections = this.transformDirections(directions);
      this.dataSource.data = this.allDirections;
      this.selectInitialIds(this.initialDirectionIds);
    });

    setInterval(() => {
      console.log('Selected:', this.selectedDirectionIds, this.selectedSubdirectionIds, this.indeterminateDirectionIds);
    }, 5000);
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
      // checked
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
    const allChildrenSelected: boolean =
      direction.children.length > 0 && direction.children.every((sub: DirectionNode) => this.selectedSubdirectionIds.includes(sub.id));
    if (allChildrenSelected && !this.selectedDirectionIds.includes(direction.id)) {
      this.selectedDirectionIds.push(direction.id);
      this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    } else if (!allChildrenSelected && this.selectedDirectionIds.includes(direction.id)) {
      this.selectedDirectionIds = this.selectedDirectionIds.filter((id: number) => id !== direction.id);
      this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    }
    return allChildrenSelected;
  }

  public subdirectionChecked(subdirection: DirectionNode): boolean {
    return this.selectedSubdirectionIds.includes(subdirection.id);
  }

  // public isDirectionIndeterminate(direction: DirectionNode): boolean {
  //   if (this.initIndeterminateIds.includes(direction.id)) {
  //     return true;
  //   }

  //   // has no children
  //   if (!direction.children || direction.children.length === 0) {
  //     this.indeterminateDirectionIds = this.indeterminateDirectionIds.filter((id: number) => id !== direction.id);
  //     this.store.dispatch(new SetIndeterminates(this.indeterminateDirectionIds));
  //     return false;
  //   }
  //   // count and compare
  //   const numSelected: number = direction.children.filter((sub: DirectionNode) => this.selectedSubdirectionIds.includes(sub.id)).length;
  //   const isIndeterminate: boolean = numSelected > 0 && numSelected < direction.children.length;

  //   if (isIndeterminate && !this.indeterminateDirectionIds.includes(direction.id)) {
  //     this.indeterminateDirectionIds.push(direction.id);
  //     this.store.dispatch(new SetIndeterminates(this.indeterminateDirectionIds));
  //   }
  //   if (!isIndeterminate) {
  //     this.indeterminateDirectionIds = this.indeterminateDirectionIds.filter((id: number) => id !== direction.id);
  //     this.store.dispatch(new SetIndeterminates(this.indeterminateDirectionIds));
  //   }
  //   return isIndeterminate;
  // }

  public isDirectionIndeterminate(direction: DirectionNode): boolean {
    // the direction is indeterminate in the initial state
    if (this.initIndeterminateIds.includes(direction.id)) {
      return true;
    }

    let newIndeterminateIds = this.indeterminateDirectionIds;

    // the direction has no children
    if (!direction.children || direction.children.length === 0) {
      newIndeterminateIds = newIndeterminateIds.filter((id: number) => id !== direction.id);
      // if the indeterminate ids are different, update the store
      if (!this.arraysEqualByValue(newIndeterminateIds, this.indeterminateDirectionIds)) {
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
    if (!this.arraysEqualByValue(newIndeterminateIds, this.indeterminateDirectionIds)) {
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
    if (node.children.length > 0) {
      // subdirections already fetched
      node.children.forEach((sub) => {
        this.selectedSubdirectionIds.push(sub.id);
      });
      this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
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

  private selectInitialIds(initials: DirectionsSelected): void {
    this.initDirectionIds = initials.selectedDirectionIds || [];
    this.initSubdirectionIds = initials.selectedSubdirectionIds || [];
    this.initIndeterminateIds = initials.indeterminateDirectionIds || [];

    this.selectedDirectionIds = initials.selectedDirectionIds || [];
    this.selectedSubdirectionIds = initials.selectedSubdirectionIds || [];
    this.indeterminateDirectionIds = initials.indeterminateDirectionIds || [];

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

  private arraysEqualByValue(a: number[], b: number[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    const setA = new Set(a);
    for (const v of b) {
      if (!setA.has(v)) {
        return false;
      }
    }
    return true;
  }
}
