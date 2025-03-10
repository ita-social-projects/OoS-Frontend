import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';

import { PaginationConstants } from 'shared/constants/constants';
import { PaginationElement } from 'shared/models/pagination-element.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges {
  @Input() public currentPage: PaginationElement;
  @Input() public totalEntities: number;
  @Input() public itemsPerPage: number;

  @Output() public pageChange = new EventEmitter<PaginationElement>();
  @Output() public itemsPerPageChange = new EventEmitter<number>();

  public readonly constants: typeof PaginationConstants = PaginationConstants;

  public carouselPageList: PaginationElement[] = [];
  public totalPageAmount: number;

  constructor() {}

  public init(): void {
    this.totalPageAmount = this.getTotalPageAmount();
    this.createPageList();
  }

  public OnSelectOption(event: MatSelectChange): void {
    this.itemsPerPageChange.emit(event.value);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.init();
    }
  }

  public onPageChange(page: PaginationElement): void {
    this.pageChange.emit(page);
  }

  public onArroveClick(isForward: boolean): void {
    const page: PaginationElement = {
      element: '',
      isActive: true
    };
    if (isForward) {
      page.element = +this.currentPage.element + 1;
    } else {
      page.element = +this.currentPage.element - 1;
    }

    this.pageChange.emit(page);
  }

  private createPageList(): void {
    this.carouselPageList = [];
    const pageList = this.createDisplayedPageList();
    this.createCarouselPageList(pageList);
  }

  private getTotalPageAmount(): number {
    return Math.ceil(this.totalEntities / this.itemsPerPage);
  }

  private createDisplayedPageList(): PaginationElement[] {
    const currentPage = +this.currentPage.element;
    let startPage: number;
    let endPage: number;

    if (this.totalPageAmount <= this.constants.VISIBLE_PAGES) {
      startPage = this.constants.FIRST_PAGINATION_PAGE;
      endPage = this.totalPageAmount;
    } else {
      startPage = Math.max(this.constants.FIRST_PAGINATION_PAGE, currentPage - this.constants.CENTER_OFFSET);

      if (currentPage > this.totalPageAmount - this.constants.CENTER_OFFSET) {
        startPage = this.totalPageAmount - this.constants.WINDOW_SIZE;
      }

      endPage = Math.min(startPage + this.constants.WINDOW_SIZE, this.totalPageAmount);

      if (endPage - startPage < this.constants.MINIMUM_DISPLAY_LENGTH) {
        startPage = Math.max(this.constants.FIRST_PAGINATION_PAGE, endPage - this.constants.WINDOW_SIZE);
      }
    }

    const pageList: PaginationElement[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pageList.push({ element: i, isActive: true });
    }
    return pageList;
  }

  private createCarouselPageList(pageList: PaginationElement[]): void {
    this.carouselPageList = [];
    const firstPageElement = Number(pageList[0]?.element);
    const lastPageElement = Number(pageList[pageList.length - 1]?.element);

    if (firstPageElement > 1) {
      this.carouselPageList.push({
        element: 1,
        isActive: true
      });

      if (firstPageElement > 2) {
        this.carouselPageList.push({
          element: this.constants.PAGINATION_DOTS,
          isActive: false
        });
      }
    }

    this.carouselPageList = this.carouselPageList.concat(pageList);

    if (lastPageElement < this.totalPageAmount) {
      if (lastPageElement < this.totalPageAmount - 1) {
        this.carouselPageList.push({
          element: this.constants.PAGINATION_DOTS,
          isActive: false
        });
      }

      this.carouselPageList.push({
        element: this.totalPageAmount,
        isActive: true
      });
    }
  }
}
