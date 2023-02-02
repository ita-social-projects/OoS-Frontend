import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { Direction } from '../../../../../shared/models/category.model';
import { DefaultFilterState } from '../../../../../shared/models/defaultFilterState.model';
import { Institution, InstituitionHierarchy, InstitutionFieldDescription } from '../../../../../shared/models/institution.model';
import { SetDirections } from '../../../../../shared/store/filter.actions';
import { GetFieldDescriptionByInstitutionId, GetAllInstitutionsHierarchy } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { InsHierarchyTableRecord } from './ins-hierarchy-table-record';


@Component({
  selector: 'app-directions-institution-hierarchies-list',
  templateUrl: './directions-institution-hierarchies-list.component.html',
  styleUrls: ['./directions-institution-hierarchies-list.component.scss']
})
export class DirectionsInstitutionHierarchiesListComponent implements OnInit, OnDestroy {
  @Input() institution: Institution;

  @Select(MetaDataState.instituitionsHierarchyAll)
  institutionsHierarchies$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.institutionFieldDesc)
  institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;

  @ViewChild(MatSort) sort: MatSort;

  destroy$: Subject<boolean> = new Subject<boolean>();
  staticColumns: string[] = ['Напрямок для користувача','actions'];
  columns: string[];
  displayedColumns: string[];
  institutionalHierarchies: InstituitionHierarchy[];
  records: InsHierarchyTableRecord[] = [];
  isLoaded: boolean = false;
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
    this.loadDirectionInstitutionHierarchiesData();
  }

  ngAfterViewInit(): void {
  }

  private loadDirectionInstitutionHierarchiesData() {
    this.store.dispatch([new GetFieldDescriptionByInstitutionId(this.institution.id),
      new GetAllInstitutionsHierarchy()]);

    this.institutionFieldDesc$.pipe(
      filter((institutionFieldDesc: InstitutionFieldDescription[]) => !!institutionFieldDesc),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((institutionFieldDesc: InstitutionFieldDescription[]) => {
        this.columns = institutionFieldDesc.map((ins: InstitutionFieldDescription) => ins.title);
        this.displayedColumns = [...this.columns, ...this.staticColumns];// = .push(...this.columns);//institutionFieldDesc.map((ins: InstitutionFieldDescription) => ins.title);//.unshift(...this.columns);
      });
    this.institutionsHierarchies$.pipe(
      filter((institutiionHierarchies: InstituitionHierarchy[]) => !!institutiionHierarchies),
      distinctUntilChanged(),
      map((institutionHierarchies: InstituitionHierarchy[]) =>
        this.createDirectionTableRecords(institutionHierarchies.filter(ins => ins.institution.title === this.institution.title))
      ),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isLoaded = true;
      this.dataSource = new MatTableDataSource(this.records);
      this.dataSource.sort = this.sort;
    });
  }

  private createDirectionTableRecords(institutionalHierarchies: InstituitionHierarchy[]) {
    if (institutionalHierarchies) {
      this.institutionalHierarchies = institutionalHierarchies;
      const firstLevelInstitutions = this.institutionalHierarchies.filter((ins: InstituitionHierarchy) => ins.hierarchyLevel === 1);
      firstLevelInstitutions.forEach((ins: InstituitionHierarchy) => {
        let insHierarchyName: string[] = [];
        this.createDirectionTableRecord(ins, [...insHierarchyName]);
      });
    }
  }

  private createDirectionTableRecord(parent: InstituitionHierarchy, insHierarchyName: string[]) {
    insHierarchyName.push(parent.title);
    let children = this.institutionalHierarchies.filter((ins: InstituitionHierarchy) => ins.parentId === parent.id);
    if (!children.length) {
      this.records.push({name: insHierarchyName, directions: parent.directions});
    }
    else {
      children.forEach((child: InstituitionHierarchy) => {
        this.createDirectionTableRecord(child, [...insHierarchyName]);
      })
    }
  }

  public selectDirection(direction: Direction): void {
    this.store.dispatch(new SetDirections([direction.id]));
    const filterQueryParams: Partial<DefaultFilterState> = { directionIds: [direction.id] };
    this.router.navigate(['result/list'], { queryParams: { filter: filterQueryParams }, replaceUrl: true });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}