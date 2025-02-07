import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { WORD_SPLIT_REGEX } from 'shared/constants/regex-constants';

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
export class CategoryCheckBoxComponent implements OnInit, AfterViewInit, OnDestroy {
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

  @ViewChild('listWrapper')
  private readonly filterContainer: ElementRef;

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
    this.directionSearchFormControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.filterDirections(value);
        this.cdr.markForCheck();
      });

    this.store.dispatch(new GetAllInstitutionsHierarchy());
    this.subDirections$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((subDirections) => {
      this.allSubDirections = subDirections;
      this.filteredSubDirections = subDirections;
      this.cdr.markForCheck();
    });

    this.subDirectionSearchFormControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.filterSubDirections(value);
        this.cdr.markForCheck();
      });
  }

  public ngAfterViewInit(): void {
    if (this.selectedDirectionIds?.length) {
      this.scrollToSelectedDirection();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method add checked direction to the list of selected directions and dispatch filter action
   * @param direction
   * @param event
   */
  public onDirectionCheck(direction: Direction, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedDirectionIds.push(direction.id);
    } else {
      this.selectedDirectionIds.splice(
        this.selectedDirectionIds.findIndex((selectedDirection: number) => selectedDirection === direction.id),
        1
      );
    }
    this.store.dispatch(new SetDirections(this.selectedDirectionIds));
  }

  public isSelected(id: number): boolean {
    return this.selectedDirectionIds.includes(id);
  }

  public onSubDirectionCheck(direction: InstituitionHierarchy, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedSubDirectionIds.push(direction.id);
    } else {
      this.selectedSubDirectionIds.splice(
        this.selectedSubDirectionIds.findIndex((selectedSubDirection: string) => selectedSubDirection === direction.id),
        1
      );
    }
    this.store.dispatch(new SetDirections(this.selectedDirectionIds));
  }

  public OnDirectionChipsRemove(directionId: number): void {
    this.selectedDirectionIds.splice(
      this.selectedDirectionIds.findIndex((selectedDirection: number) => selectedDirection === directionId),
      1
    );
    this.store.dispatch(new SetDirections(this.selectedDirectionIds));
  }

  public OnSubDirectionChipsRemove(subDirectionId: string): void {
    this.selectedSubDirectionIds.splice(
      this.selectedSubDirectionIds.findIndex((selectedDirection: string) => selectedDirection === subDirectionId),
      1
    );
    this.store.dispatch(new SetSubDirections(this.selectedDirectionIds));
  }

  public getDirectionTitle(directionId: number): string {
    return this.allDirections.find((direction: Direction) => direction.id === directionId).title;
  }

  public getSubDirectionTitle(directionId: number): string {
    return this.allDirections.find((direction: Direction) => direction.id === directionId).title;
  }

  /**
   * This method check if value is checked
   * @returns boolean
   */
  public onDirectionSelectCheck(direction: Direction): boolean {
    return this.selectedDirectionIds.some((directionId: number) => directionId === direction.id);
  }

  public onSubDirectionSelectCheck(subDirection: InstituitionHierarchy): boolean {
    return this.selectedSubDirectionIds?.some((directionId: string) => directionId === subDirection.id);
  }
  /**
   * This method filter directions according to the input value
   * @param value string
   */
  private filterDirections(value: string): void {
    this.filteredDirections = this.allDirections.filter((direction: Direction) =>
      direction.title
        .toLowerCase()
        .split(WORD_SPLIT_REGEX)
        .some((word) => word.startsWith(value.toLowerCase()))
    );
  }

  private filterSubDirections(value: string): void {
    this.filteredSubDirections = this.allSubDirections.filter((subDirection: InstituitionHierarchy) =>
      subDirection.title.toLowerCase().startsWith(value.toLowerCase())
    );
  }

  private scrollToSelectedDirection(): void {
    setTimeout(() => {
      const itemsList: HTMLCollection = this.filterContainer.nativeElement.children;
      for (let i = 0; i <= itemsList.length; i++) {
        const checkboxElement = itemsList.item(i)?.children[0];

        if (checkboxElement?.classList.contains('mat-checkbox-checked')) {
          this.filterContainer.nativeElement.scrollTop = this.filterContainer.nativeElement.children[i].offsetTop;
        }
      }
    }, 500); // this is needed to wait until loaded direction list will be displayed in the template
  }
}
