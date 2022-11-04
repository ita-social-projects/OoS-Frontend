import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Child } from 'src/app/shared/models/child.model';
import { Direction } from '../../../models/category.model';
import { AppState } from '../../../store/app.state';
import { SetDirections } from '../../../store/filter.actions';
import { GetDirections } from '../../../store/meta-data.actions';
import { MetaDataState } from '../../../store/meta-data.state';


@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss'],
})
export class CategoryCheckBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @Select(MetaDataState.directions)
    directions$: Observable<Direction[]>;
  @Select(AppState.isMobileScreen)
    isMobileScreen$: Observable<boolean>;

  @ViewChild('listWrapper') filterContainer: ElementRef;

  @Input() stateDirections: Direction[];
  @Input()
  set categoryCheckBox(filter: Direction[]) {
    this.selectedDirections = filter;
  }

  destroy$: Subject<boolean> = new Subject<boolean>();
  allDirections: Direction[] = [];
  selectedDirections: Direction[] = [];
  filteredDirections: Direction[] = [];
  directionSearch = new FormControl('');
  showAll = true;

  constructor(private store: Store) {}

  ngAfterViewInit(): void {
    this.directions$.pipe(filter((direction)=> !!direction), 
    takeUntil(this.destroy$)).subscribe(directions => {
      this.allDirections = directions; 
      if (this.stateDirections) { 
        this.selectedDirections = this.stateDirections;
        this.scrollToSelectedDirection();
      };
    });
  }  

  ngOnInit(): void {
    this.store.dispatch(new GetDirections());

 
    this.directionSearch.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe((val: string) => {
        this.showAll = !!val;
        if (val) {
          this.onDirectionFilter(val);
        } else {
          this.filteredDirections = [];
        }
      });
  }

  /**
   * This method add checked direction to the list of selected directions and distpatch filter action
   * @param direction
   * @param event
   */
  onDirectionCheck(direction: Direction, event: MatCheckbox): void {
    event.checked
      ? this.selectedDirections.push(direction)
      : this.selectedDirections.splice(
        this.selectedDirections.findIndex((selectedDirection: Direction) => selectedDirection.id === direction.id),
        1
      );
      this.store.dispatch(new SetDirections(this.selectedDirections));
      console.log(this.store.dispatch(new SetDirections(this.selectedDirections)));
    }

  /**
   * This method filter directions according to the input value
   * @param value string
   */
  onDirectionFilter(value: string): void {
    this.filteredDirections = this.allDirections
      .filter(direction => direction.title.toLowerCase().startsWith(value.toLowerCase()))
      .map(direction => direction);
  }

  /**
   * This method check if value is checked
   * @returns boolean
   */
  onSelectCheck(value: Direction): boolean {
    const result = this.selectedDirections.some(direction => direction.title.startsWith(value.title));
    return result;
  }

  private scrollToSelectedDirection(): void {
    setTimeout(() => {
      const itemsList: HTMLCollection = this.filterContainer.nativeElement.children; //list of li elements
      for(let i = 0; i <= itemsList.length; i++ ){
        const checkboxElement = itemsList.item(i)?.children[0]; // checkbox element of li item
  
        if(checkboxElement?.classList.contains('mat-checkbox-checked')){
          console.log(checkboxElement);
          this.filterContainer.nativeElement.scrollTop = this.filterContainer.nativeElement.children[i].offsetTop;
        }
      }
    }, 1000)
  }

  onSearch(): void {
    this.showAll = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
