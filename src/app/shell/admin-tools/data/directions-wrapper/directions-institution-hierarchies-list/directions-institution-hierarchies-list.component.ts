import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { InstituitionHierarchy } from 'src/app/shared/models/institution.model';
import { GetAllInstitutionsHierarchy } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-directions-institution-hierarchies-list',
  templateUrl: './directions-institution-hierarchies-list.component.html',
  styleUrls: ['./directions-institution-hierarchies-list.component.scss']
})
export class DirectionsInstitutionHierarchiesListComponent implements OnInit, OnDestroy {
  @Input() institutionTitle: string;
  @Input() displayedColumns: string[];

  @Select(MetaDataState.instituitionsHierarchyAll)
  institutionsHierarchies$: Observable<InstituitionHierarchy[]>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  institutionalHierarchies: InstituitionHierarchy[];
  records: string[][];
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  constructor(private store: Store) {
    this.store.dispatch(new GetAllInstitutionsHierarchy());
  }

  ngOnInit(): void {
    this.institutionsHierarchies$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      map((institutionHierarchies: InstituitionHierarchy[]) =>
        this.createDirectionTableRecords(institutionHierarchies?.filter(i => i.institution.title == this.institutionTitle))
      ),
    ).subscribe(() => {
      this.dataSource = new MatTableDataSource(this.records);
    });
  }

  createDirectionTableRecords(institutionalHierarchies: InstituitionHierarchy[]) {
    if (institutionalHierarchies) {
      this.institutionalHierarchies = institutionalHierarchies;
      this.records = [];
      let firstLevelInstitutions = this.institutionalHierarchies.filter(ins => ins.hierarchyLevel == 1);
      firstLevelInstitutions.forEach(ins => {
        let records: string[] = [];
        this.createDirectionTableRecord(ins, [...records]);
      });
    }
  }

  createDirectionTableRecord(parent: InstituitionHierarchy, records: string[]) {
    records.push(parent.title);
    let children = this.institutionalHierarchies.filter(ins => ins.parentId == parent.id);
    if (children.length == 0) {
      this.records.push(records);
    }
    else {
      children.forEach(child => {
        this.createDirectionTableRecord(child, [...records]);
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}