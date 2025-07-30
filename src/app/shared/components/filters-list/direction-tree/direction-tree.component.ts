import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, takeUntil, Subject, map } from 'rxjs';
import { Direction, DirectionNode, Subdirection } from 'shared/models/category.model';
import { DirectionsService } from 'shared/services/directions/directions.service';
import { SetSubdirections, SetDirections } from 'shared/store/filter.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-direction-tree',
  templateUrl: './direction-tree.component.html',
  styleUrls: ['./direction-tree.component.scss']
})
export class DirectionTreeComponent implements OnDestroy, OnInit {
  @Input()
  public filteredDirections: Direction[];
  @Input()
  public initialDirectionIds: number[];

  @Select(MetaDataState.directions)
  private directions$: Observable<Direction[]>;

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
    });
    // set initial selected direction ids
    this.selectedDirectionIds = this.initialDirectionIds.slice() || [];
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
      // this.store.dispatch(new SetDirections(this.selectedDirectionIds));

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
      this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
    } else {
      // unchecked
      this.selectedSubdirectionIds = this.selectedSubdirectionIds.filter((id: number) => id !== subdirection.id);
      this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
    }
  }

  public directionChecked(direction: DirectionNode): boolean {
    // check if all children are selected
    const allChildrenSelected: boolean =
      direction.children.length > 0 && direction.children.every((sub: DirectionNode) => this.selectedSubdirectionIds.includes(sub.id));
    if (allChildrenSelected && !this.selectedDirectionIds.includes(direction.id)) {
      this.selectedDirectionIds.push(direction.id);
      // this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    } else if (!allChildrenSelected && this.selectedDirectionIds.includes(direction.id)) {
      this.selectedDirectionIds = this.selectedDirectionIds.filter((id: number) => id !== direction.id);
      // this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    }
    return allChildrenSelected;
  }

  public subdirectionChecked(subdirection: DirectionNode): boolean {
    return this.selectedSubdirectionIds.includes(subdirection.id);
  }

  public isDirectionIndeterminate(direction: DirectionNode): boolean {
    // has no children
    if (!direction.children || direction.children.length === 0) {
      this.indeterminateDirectionIds = this.indeterminateDirectionIds.filter((id: number) => id !== direction.id);
      return false;
    }
    // count and compare
    const numSelected: number = direction.children.filter((sub: DirectionNode) => this.selectedSubdirectionIds.includes(sub.id)).length;
    const isIndeterminate: boolean = numSelected > 0 && numSelected < direction.children.length;

    if (isIndeterminate && !this.indeterminateDirectionIds.includes(direction.id)) {
      this.indeterminateDirectionIds.push(direction.id);
    }
    if (!isIndeterminate) {
      this.indeterminateDirectionIds = this.indeterminateDirectionIds.filter((id: number) => id !== direction.id);
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
    // this.store.dispatch(new SetDirections(this.selectedDirectionIds));
    // remove all children ids
    if (direction.children && direction.children.length > 0) {
      direction.children.forEach((sub: Subdirection) => {
        this.selectedSubdirectionIds = this.selectedSubdirectionIds.filter((id: number) => id !== sub.id);
      });
      this.store.dispatch(new SetSubdirections(this.selectedSubdirectionIds));
    }
  }
}
