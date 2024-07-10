import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';

import { Direction } from 'shared/models/category.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { InstituitionHierarchy, Institution, InstitutionFieldDescription } from 'shared/models/institution.model';
import { SetDirections } from 'shared/store/filter.actions';
import { GetAllInstitutionsHierarchy, GetFieldDescriptionByInstitutionId } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
// eslint-disable-next-line max-len
import { DirectionsInstitutionHierarchiesEditFormComponent } from '../directions-institution-hierarchies-edit-form/directions-institution-hierarchies-edit-form.component';
import { InsHierarchyTableRecord } from './ins-hierarchy-table-record';

@Component({
  selector: 'app-directions-institution-hierarchies-list',
  templateUrl: './directions-institution-hierarchies-list.component.html',
  styleUrls: ['./directions-institution-hierarchies-list.component.scss']
})
export class DirectionsInstitutionHierarchiesListComponent implements OnInit, OnDestroy {
  @Input() public institution: Institution;

  @Select(MetaDataState.instituitionsHierarchyAll)
  public institutionsHierarchies$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.institutionFieldDesc)
  public institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;

  @ViewChild(MatSort) public sort: MatSort;

  public staticColumns: string[] = ['Напрямок для користувача', 'actions'];
  public columns: string[];
  public displayedColumns: string[];
  public institutionalHierarchies: InstituitionHierarchy[];
  public records: InsHierarchyTableRecord[] = [];
  public isLoaded: boolean = false;
  public dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.loadDirectionInstitutionHierarchiesData();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public selectDirection(direction: Direction): void {
    this.store.dispatch(new SetDirections([direction.id]));
    const filterQueryParams: Partial<DefaultFilterState> = { directionIds: [direction.id] };
    this.router.navigate(['result/List'], { queryParams: { filter: filterQueryParams }, replaceUrl: true });
  }

  public onEdit(element: InsHierarchyTableRecord): void {
    const dialogRef = this.matDialog.open(DirectionsInstitutionHierarchiesEditFormComponent, {
      data: {
        columns: this.columns,
        element: element
      },
      autoFocus: false
    });
  }

  private loadDirectionInstitutionHierarchiesData(): void {
    this.store.dispatch([new GetFieldDescriptionByInstitutionId(this.institution.id), new GetAllInstitutionsHierarchy()]);

    this.institutionFieldDesc$
      .pipe(
        filter((institutionFieldDesc: InstitutionFieldDescription[]) => !!institutionFieldDesc),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((institutionFieldDesc: InstitutionFieldDescription[]) => {
        this.columns = institutionFieldDesc.map((ins: InstitutionFieldDescription) => ins.title);
        this.displayedColumns = [...this.columns, ...this.staticColumns];
      });
    this.institutionsHierarchies$
      .pipe(
        filter((institutiionHierarchies: InstituitionHierarchy[]) => !!institutiionHierarchies),
        distinctUntilChanged(),
        map((institutionHierarchies: InstituitionHierarchy[]) =>
          this.createDirectionTableRecords(institutionHierarchies.filter((ins) => ins.institution.title === this.institution.title))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isLoaded = true;
        this.dataSource = new MatTableDataSource(this.records);
        this.dataSource.sort = this.sort;
      });
  }

  private createDirectionTableRecords(institutionalHierarchies: InstituitionHierarchy[]): void {
    if (institutionalHierarchies) {
      this.institutionalHierarchies = institutionalHierarchies;
      const firstLevelInstitutions = this.institutionalHierarchies.filter((ins: InstituitionHierarchy) => ins.hierarchyLevel === 1);
      firstLevelInstitutions.forEach((ins: InstituitionHierarchy) => {
        const insHierarchyName: string[] = [];
        const insHierarchies: InstituitionHierarchy[] = [];
        this.createDirectionTableRecord(ins, [...insHierarchyName], [...insHierarchies]);
      });
    }
  }

  private createDirectionTableRecord(
    parent: InstituitionHierarchy,
    insHierarchyName: string[],
    insHierarchies: InstituitionHierarchy[]
  ): void {
    insHierarchyName.push(parent.title);
    insHierarchies.push(parent);
    const children = this.institutionalHierarchies.filter((ins: InstituitionHierarchy) => ins.parentId === parent.id);
    if (!children.length) {
      this.records.push({ name: insHierarchyName, directions: parent.directions, insHierarchies: insHierarchies });
    } else {
      children.forEach((child: InstituitionHierarchy) => {
        this.createDirectionTableRecord(child, [...insHierarchyName], [...insHierarchies]);
      });
    }
  }
}
