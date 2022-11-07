import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { Institution, InstituitionHierarchy, InstitutionFieldDescription } from '../../../../../shared/models/institution.model';
import { GetFieldDescriptionByInstitutionId, GetAllInstitutionsHierarchy } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';


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

  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[];
  institutionalHierarchies: InstituitionHierarchy[];
  records: string[][];
  isLoaded: boolean = false;
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch([new GetFieldDescriptionByInstitutionId(this.institution.id),
      new GetAllInstitutionsHierarchy()]);

    this.institutionFieldDesc$.pipe(
      filter((institutionFieldDesc: InstitutionFieldDescription[]) => !!institutionFieldDesc),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((institutionFieldDesc: InstitutionFieldDescription[]) => {
        this.store.snapshot
        this.displayedColumns = institutionFieldDesc.map((ins: InstitutionFieldDescription) => ins.title);
      });
    this.institutionsHierarchies$.pipe(
      filter((institutiionHierarchies: InstituitionHierarchy[]) => !!institutiionHierarchies),
      distinctUntilChanged(),
      map((institutionHierarchies: InstituitionHierarchy[]) =>
        this.createDirectionTableRecords(institutionHierarchies.filter(i => i.institution.title == this.institution.title))
      ),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isLoaded = true;
      this.dataSource = new MatTableDataSource(this.records)
    });
  }

  private createDirectionTableRecords(institutionalHierarchies: InstituitionHierarchy[]) {
    if (institutionalHierarchies) {
      this.institutionalHierarchies = institutionalHierarchies;
      this.records = [];
      const firstLevelInstitutions = this.institutionalHierarchies.filter((ins: InstituitionHierarchy) => ins.hierarchyLevel == 1);
      firstLevelInstitutions.forEach((ins: InstituitionHierarchy) => {
        let records: string[] = [];
        this.createDirectionTableRecord(ins, [...records]);
      });
    }
  }

  private createDirectionTableRecord(parent: InstituitionHierarchy, records: string[]) {
    records.push(parent.title);
    let children = this.institutionalHierarchies.filter((ins: InstituitionHierarchy) => ins.parentId == parent.id);
    if (!children.length) {
      this.records.push(records);
    }
    else {
      children.forEach((child: InstituitionHierarchy) => {
        this.createDirectionTableRecord(child, [...records]);
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}