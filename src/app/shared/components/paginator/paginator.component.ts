import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { PaginationConstants } from 'shared/constants/constants';
import { PaginationElement } from 'shared/models/pagination-element.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges {
  public readonly constants: typeof PaginationConstants = PaginationConstants;

  @Input() public currentPage: PaginationElement;
  @Input() public totalEntities: number;
  @Input() public itemsPerPage: number;

  @Output() public pageChange = new EventEmitter<PaginationElement>();
  @Output() public itemsPerPageChange = new EventEmitter<number>();

  public carouselPageList: PaginationElement[] = [];
  public totalPageAmount: number;
  public listOfValues: number[] = [8, 12, 16, 20, 25, 50];

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
    let startPage = +this.currentPage.element - this.constants.PAGINATION_SHIFT_DELTA;
    startPage = startPage < this.constants.FIRST_PAGINATION_PAGE ? this.constants.FIRST_PAGINATION_PAGE : startPage;

    const carouselLength = this.constants.MAX_PAGE_PAGINATOR_DISPLAY + startPage - 1;

    const endPage = carouselLength <= this.totalPageAmount ? carouselLength : this.totalPageAmount;

    const pageList: PaginationElement[] = [];

    while (startPage < endPage + 1) {
      pageList.push({
        element: startPage,
        isActive: true
      });
      startPage++;
    }
    return pageList;
  }

  private createCarouselPageList(pageList: PaginationElement[]): void {
    if (pageList[0]?.element !== this.constants.FIRST_PAGINATION_PAGE) {
      const start: PaginationElement[] = [
        {
          element: this.constants.FIRST_PAGINATION_PAGE,
          isActive: true
        },
        {
          element: this.constants.PAGINATION_DOTS,
          isActive: false
        }
      ];
      this.carouselPageList = this.carouselPageList.concat(start);
    }

    this.carouselPageList = this.carouselPageList.concat(pageList);

    if (pageList[pageList.length - 1]?.element !== this.totalPageAmount) {
      const end: PaginationElement[] = [
        {
          element: this.constants.PAGINATION_DOTS,
          isActive: false
        },
        {
          element: this.totalPageAmount,
          isActive: true
        }
      ];
      this.carouselPageList = this.carouselPageList.concat(end);
    }
  }
}
