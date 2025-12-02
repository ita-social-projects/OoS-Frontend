import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { WORD_SPLIT_REGEX } from 'shared/constants/regex-constants';

import { Direction, DirectionsSelected } from 'shared/models/category.model';
import { AppState } from 'shared/store/app.state';
import { GetDirections } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss']
})
export class CategoryCheckBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public directionsSelected: DirectionsSelected;

  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;

  @ViewChild('listWrapper')
  private filterContainer: ElementRef;

  public directionSearchFormControl = new FormControl('');
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetDirections());
  }

  public ngAfterViewInit(): void {
    if (this.directionsSelected?.selectedDirectionIds?.length) {
      this.scrollToSelectedDirection();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
