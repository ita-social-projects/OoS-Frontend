import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { WORD_SPLIT_REGEX } from 'shared/constants/regex-constants';
import { CheckChangeEvent } from 'shared/models/filter-list.model';

@Component({
  selector: 'app-filterable-checklist',
  templateUrl: './filterable-checklist.component.html',
  styleUrls: ['./filterable-checklist.component.scss']
})
export class FilterableChecklistComponent<T extends { title: string; id: number | string }> implements OnInit, OnDestroy {
  @Input() public items: T[] = [];
  @Input() public selectedItemIds: (string | number)[] = [];
  @Input() public title: string;
  @Input() public placeholder: string;

  @Output() public selectedItemsChange = new EventEmitter<CheckChangeEvent>();

  @ViewChild(CdkVirtualScrollViewport)
  private readonly viewport: CdkVirtualScrollViewport;
  public searchFormControl = new FormControl('');
  public filteredItems: T[] = [];
  public openPanelState = false;

  private readonly destroy$ = new Subject<void>();

  constructor(public readonly cdr: ChangeDetectorRef) {}
  public ngOnInit(): void {
    this.filteredItems = [...this.items];

    this.searchFormControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.filterItems(value);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * This method add checked items to the list of selected items and emit event to dispatch according filter action
   * @param direction
   * @param event
   */
  public onCheckChange(itemId: string | number, checked: boolean): void {
    if (checked) {
      this.selectedItemIds.push(itemId);
    } else {
      this.selectedItemIds.splice(
        this.selectedItemIds.findIndex((selectedItem: number) => selectedItem === itemId),
        1
      );
    }
    this.selectedItemsChange.emit({ selectedItemsIds: this.selectedItemIds, changedItemId: itemId });
  }

  /**
   * This method check if value is checked
   * @returns boolean
   */
  public isChecked(item: T): boolean {
    return this.selectedItemIds.includes(item.id);
  }

  public getItemTitleById(id: string | number): string | number {
    return this.items.find((selectedId) => selectedId.id === id).title;
  }

  public onOpenPanel(): void {
    this.openPanelState = true;
    this.scrollToSelectedDirection();
  }

  /**
   * This method filter items according to the input value
   * @param value string
   */
  private filterItems(value: string): void {
    this.filteredItems = this.items.filter((item: T) =>
      item.title
        .toLowerCase()
        .split(WORD_SPLIT_REGEX)
        .some((word) => word.startsWith(value.toLowerCase()))
    );
    this.cdr.markForCheck();
  }

  private scrollToSelectedDirection(): void {
    const selectedIndex = this.filteredItems.findIndex((item) => this.isChecked(item));
    this.viewport.scrollToIndex(selectedIndex || 0);
  }
}
