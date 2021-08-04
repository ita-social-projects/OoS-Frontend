import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginationElement } from '../../models/paginationElement.model';
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {

  private readonly FIRST_PAGINATION_PAGE = 1;
  private readonly MAX_PAGE_PAGINATOR_DISPLAY = 7;
  private readonly PAGINATION_DOTS = '...';
  private readonly PAGINATION_SHIFT_DELTA = 3;

  @Input() currentPage: PaginationElement;
  @Input() totalEntities: number;

  carouselPageList: PaginationElement[] = [];
  totalPageAmount: number;

  @Output() pageChange = new EventEmitter<PaginationElement>();

  constructor() { }

  ngOnInit(): void {
    this.totalPageAmount = this.getTotalPageAmount();

    this.createInitialPageList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentPage.previousValue) {
      let isForward: boolean = changes.currentPage.previousValue.element < changes.currentPage.currentValue.element;
      if (isForward) {
        if (this.carouselPageList.indexOf(this.currentPage) > this.PAGINATION_SHIFT_DELTA) {
          this.onRecreateDisplayedPageList();
        }
      } else {
        if (this.carouselPageList.indexOf(this.currentPage) < this.PAGINATION_SHIFT_DELTA) {
          this.onRecreateDisplayedPageList();
        }
      }
    }

  }

  private onRecreateDisplayedPageList(): void {
    this.carouselPageList = [];

    let firstPage = +this.currentPage.element - this.PAGINATION_SHIFT_DELTA;
    firstPage = firstPage < this.FIRST_PAGINATION_PAGE ? this.FIRST_PAGINATION_PAGE : firstPage;

    let lastPage = +this.currentPage.element + this.PAGINATION_SHIFT_DELTA;
    lastPage = lastPage > this.totalPageAmount ? this.totalPageAmount : lastPage;

    let pageList = this.createDisplayedPageList(firstPage, lastPage);

    if (this.totalPageAmount < this.MAX_PAGE_PAGINATOR_DISPLAY) {
      this.carouselPageList = pageList;
    } else {
      this.createCarouselPageList(pageList, pageList[0].element !== this.FIRST_PAGINATION_PAGE, true);
    }

  }

  onPageChange(pageNum: number): void {
    let page: PaginationElement = {
      element: pageNum,
      isActive: true
    };
    this.pageChange.emit(page);
  }

  private createInitialPageList() {
    let pageList = [];

    if (this.totalPageAmount < this.MAX_PAGE_PAGINATOR_DISPLAY) {
      pageList = this.createDisplayedPageList(this.FIRST_PAGINATION_PAGE, this.totalPageAmount);
      this.carouselPageList = pageList;
    } else {
      pageList = this.createDisplayedPageList(this.FIRST_PAGINATION_PAGE, this.MAX_PAGE_PAGINATOR_DISPLAY);
      this.createCarouselPageList(pageList, false, true);
    }
  }

  private getTotalPageAmount(): number {
    return Math.ceil(this.totalEntities / this.MAX_PAGE_PAGINATOR_DISPLAY);
  }

  private createDisplayedPageList(startPage: number, endPage: number): PaginationElement[] {
    let i: number = startPage;
    let pageList: PaginationElement[] = [];
    while (i < endPage) {
      pageList.push({
        element: i,
        isActive: true
      });
      i++;
    }

    return pageList;
  }

  private createCarouselPageList(pageList: PaginationElement[], isOnStart?: boolean, isOnEnd?: boolean) {
    if (isOnStart) {
      let start: PaginationElement[] = [
        {
          element: this.FIRST_PAGINATION_PAGE,
          isActive: true
        }
      ];
      if (pageList[0].element !== 2) {
        start.push(
          {
            element: this.PAGINATION_DOTS,
            isActive: false
          })
      }
      this.carouselPageList = this.carouselPageList.concat(start);
    };

    this.carouselPageList = this.carouselPageList.concat(pageList);

    if (isOnEnd) {
      let end: PaginationElement[] = [
        {
          element: this.totalPageAmount,
          isActive: true
        }
      ];
      if (pageList[pageList.length - 1].element !== this.totalPageAmount) {
        end.unshift({
          element: this.PAGINATION_DOTS,
          isActive: false
        })
      }
      this.carouselPageList = this.carouselPageList.concat(end);
    }
  }

}
