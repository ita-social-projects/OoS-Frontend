import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, takeUntil, Subject, map } from 'rxjs';
import { Direction, DirectionFlatNode, DirectionNode, Subdirection } from 'shared/models/category.model';
import { DirectionsService } from 'shared/services/directions/directions.service';
import { SetDirections } from 'shared/store/filter.actions';
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
  public selectedDirectionIds: number[];

  @Select(MetaDataState.directions)
  private directions$: Observable<Direction[]>;

  public treeControl = new FlatTreeControl<DirectionFlatNode>(
    (node) => node.level,
    (node) => node.expanded
  );

  public treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expanded,
    (node) => node.children
  );

  public dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private allDirections: Direction[] = [];
  private indeterminateDirectionIds: number[] = [];
  private selectedSubdirectionIds: number[] = [];

  private isFetching: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly directionsService: DirectionsService,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.directions$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((directions: Direction[]) => {
      // update data source when directions are received
      this.allDirections = directions.map((d: Direction) => ({ ...d, subdirections: d.subdirections || [] }));
      this.dataSource.data = this.buildTreeData(directions);
    });

    this.treeControl.expansionModel.changed.pipe(takeUntil(this.destroy$)).subscribe((change) => {
      change.added.forEach((flatNode: DirectionFlatNode) => {
        if (flatNode.fullData && (!flatNode.fullData.subdirections || flatNode.fullData.subdirections.length === 0)) {
          this.fetchAndAddSubdirections(flatNode.fullData);
        }
      });
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
  public buildTreeData(directions: Direction[]): DirectionNode[] {
    return directions.map((direction: Direction) => ({
      name: direction.title,
      id: direction.id,
      // store full direction object for later use
      direction: direction,
      children: direction.subdirections
        ? direction.subdirections.map((subdireciton: Subdirection) => ({
            name: subdireciton.title,
            id: subdireciton.id
          }))
        : []
    }));
  }

  /**
   * This method transform direction node to flat node
   * @param node
   * @param level
   * @returns DirectionFlatNode
   */
  public transformer(node: DirectionNode, level: number): DirectionFlatNode {
    return {
      expanded: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
      fullData: node.direction
    };
  }

  /**
   * This method add checked direction to the list of selected directions and dispatch filter action
   * @param direction
   * @param event
   */
  public onDirectionCheck(direction: DirectionFlatNode, event: MatCheckboxChange): void {
    if (event.checked) {
      if (direction.level === 0) {
        this.selectedDirectionIds.push(direction.id);
        // expand direction and mark its subdirections as selected
        this.isFetching = true;
        this.fetchAndAddSubdirections(direction.fullData);
      } else if (direction.level === 1) {
        this.selectedSubdirectionIds.push(direction.id);
      }
    } else {
      if (direction.level === 0) {
        // remove direction and its subdirections
        this.removeDirectionAndChildren(direction.fullData);
      } else if (direction.level === 1) {
        // remove subdirection from selected subdirections list
        this.selectedSubdirectionIds = this.selectedSubdirectionIds.filter((id: number) => id !== direction.id);
      }
    }
    this.store.dispatch(new SetDirections(this.selectedDirectionIds));
  }

  /**
   * This method check if value is checked
   * @returns boolean
   */
  public onSelectCheck(direction: DirectionFlatNode): boolean {
    if (direction.level === 0) {
      // check if all children are selected
      if (direction.expanded) {
        const allChildrenSelected: boolean = direction.fullData?.subdirections.every((sub: Subdirection) =>
          this.selectedSubdirectionIds.includes(sub.id)
        );
        if (allChildrenSelected && !this.selectedDirectionIds.includes(direction.id)) {
          this.selectedDirectionIds.push(direction.id);
        } else if (!allChildrenSelected && this.selectedDirectionIds.includes(direction.id) && !this.isFetching) {
          this.selectedDirectionIds = this.selectedDirectionIds.filter((id: number) => id !== direction.id);
        }
        this.store.dispatch(new SetDirections(this.selectedDirectionIds));
        return allChildrenSelected;
      }
      // else return if parent is selected
      return this.selectedDirectionIds.includes(direction.id);
    } else if (direction.level === 1) {
      // check if subdirection is selected
      return this.selectedSubdirectionIds.includes(direction.id);
    }
  }

  public isParentIndeterminate(direction: DirectionFlatNode): boolean {
    // check if item has children
    if (!direction.fullData?.subdirections || direction.fullData?.subdirections.length === 0) {
      this.indeterminateDirectionIds = this.indeterminateDirectionIds.filter((id: number) => id !== direction.id);
      return false;
    }
    // find the number of selected subdirections
    const numSelected = direction.fullData?.subdirections.filter((sub: Subdirection) =>
      this.selectedSubdirectionIds.includes(sub.id)
    ).length;
    const isIndeterminate: boolean = numSelected > 0 && numSelected < direction.fullData?.subdirections.length;
    if (isIndeterminate && !this.indeterminateDirectionIds.includes(direction.id)) {
      this.indeterminateDirectionIds.push(direction.id);
    }
    if (!isIndeterminate) {
      this.indeterminateDirectionIds = this.indeterminateDirectionIds.filter((id: number) => id !== direction.id);
    }
    return isIndeterminate;
  }

  private removeDirectionAndChildren(direction: Direction): void {
    // remove parent's id
    this.selectedDirectionIds = this.selectedDirectionIds.filter((id: number) => id !== direction.id);
    // remove all children ids
    if (direction.subdirections && direction.subdirections.length > 0) {
      direction.subdirections.forEach((sub: Subdirection) => {
        this.selectedSubdirectionIds = this.selectedSubdirectionIds.filter((id: number) => id !== sub.id);
      });
    }
  }

  /**
   * This method fetch subdirections from server and add them to the direction
   * @param direction
   */
  private fetchAndAddSubdirections(direction: Direction): void {
    const expandedIds = this.treeControl.dataNodes.filter((node) => this.treeControl.isExpanded(node)).map((node) => node.id);

    this.directionsService
      .getSubdirections(direction.id)
      .pipe(
        map((response) => response.entities),
        takeUntil(this.destroy$)
      )
      .subscribe((subdirections: Subdirection[]) => {
        direction.subdirections = subdirections || [];
        if (this.selectedDirectionIds.includes(direction.id)) {
          direction.subdirections.forEach((sub: Subdirection) => {
            if (!this.selectedSubdirectionIds.includes(sub.id)) {
              this.selectedSubdirectionIds.push(sub.id);
            }
          });
          this.isFetching = false;
        }
        // Update the tree data source with the new subdirections
        this.dataSource.data = this.buildTreeData(this.allDirections);

        setTimeout(() => {
          this.treeControl.dataNodes.forEach((node) => {
            if (expandedIds.includes(node.id)) {
              this.treeControl.expand(node);
            }
          });

          // find the flat node corresponding to this direction and re-expand it.
          const flatNodes = this.treeControl.dataNodes;
          const targetNode = flatNodes.find((node) => node.id === direction.id);
          if (targetNode) {
            this.treeControl.expand(targetNode);
          }
        }, 0);
      });
  }

  /**
   * This method add subdirection id to the list of selected subdirections
   * @param direction
   */
  private addIfSubdirection(direction: DirectionFlatNode): void {
    if (direction.level === 1) {
      this.selectedSubdirectionIds.push(direction.id);
    }
  }
}
