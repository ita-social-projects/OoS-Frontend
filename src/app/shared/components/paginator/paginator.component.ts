import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Constants } from '../../constants/constants';
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
  size: number = Constants.WORKSHOPS_PER_PAGE;

  @Output() pageChange = new EventEmitter<PaginationElement>();

  constructor() { }

  ngOnInit(): void {
    this.totalPageAmount = this.getTotalPageAmount();

    this.createPageList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.currentPage.isFirstChange()) {
      const currentPage = this.carouselPageList.find((page: PaginationElement) => page.element === this.currentPage.element);

      let isForward: boolean = changes.currentPage.previousValue.element < changes.currentPage.currentValue.element;
      if (isForward) {
        if (this.carouselPageList.indexOf(currentPage) >= this.PAGINATION_SHIFT_DELTA) {
          this.createPageList();
        }
      } else {
        if (this.carouselPageList.indexOf(currentPage) <= this.PAGINATION_SHIFT_DELTA) {
          this.createPageList();
        }
      }
    }
  }

  private createPageList(): void {
    this.carouselPageList = [];

    let firstPage = +this.currentPage.element - this.PAGINATION_SHIFT_DELTA;
    firstPage = firstPage < this.FIRST_PAGINATION_PAGE ? this.FIRST_PAGINATION_PAGE : firstPage;

    let lastPage = +this.currentPage.element + this.PAGINATION_SHIFT_DELTA;
    lastPage = lastPage > this.totalPageAmount ? this.totalPageAmount : lastPage;

    let pageList = this.createDisplayedPageList(firstPage);

    if (this.totalPageAmount < this.MAX_PAGE_PAGINATOR_DISPLAY) {
      this.carouselPageList = pageList;
    } else {
      this.createCarouselPageList(pageList, pageList[0]?.element !== this.FIRST_PAGINATION_PAGE, true);
    }

  }

  onPageChange(page: PaginationElement): void {
    this.pageChange.emit(page);
  }

  onArroveClick(isForward: boolean): void {
    let page: PaginationElement = {
      element: '',
      isActive: true,
    }
    if (isForward) {
      page.element = +this.currentPage.element + 1;
    } else {
      page.element = +this.currentPage.element - 1;
    }

    this.pageChange.emit(page);
  }

  private getTotalPageAmount(): number {
    return Math.ceil(this.totalEntities / this.size);
  }

  private createDisplayedPageList(startPage: number): PaginationElement[] {
    let i: number;
    let end: number;
    if (this.totalPageAmount > this.MAX_PAGE_PAGINATOR_DISPLAY) {
      const isMaxAmountFit = (startPage + this.MAX_PAGE_PAGINATOR_DISPLAY) < this.totalPageAmount;
      i = (isMaxAmountFit) ? startPage : this.totalPageAmount - this.MAX_PAGE_PAGINATOR_DISPLAY;
      end = this.MAX_PAGE_PAGINATOR_DISPLAY;
    } else {
      i = startPage;
      end = this.totalPageAmount;
    }

    let pageList: PaginationElement[] = [];
    while (pageList.length < end) {
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

      if (pageList[0]?.element !== 2) {
        start.push(
          {
            element: this.PAGINATION_DOTS,
            isActive: false
          })
      }

      this.carouselPageList = this.carouselPageList.concat(start);
    };

    if (pageList[0]?.element === 2) {
      pageList.pop();
    }

    if (pageList[pageList.length - 1]?.element === this.totalPageAmount - 1) {
      pageList.shift();
    }

    this.carouselPageList = this.carouselPageList.concat(pageList);


    if (isOnEnd) {
      let end: PaginationElement[] = [
        {
          element: this.totalPageAmount,
          isActive: true
        }
      ];
      if (pageList[pageList.length - 1]?.element !== this.totalPageAmount - 1) {
        end.unshift({
          element: this.PAGINATION_DOTS,
          isActive: false
        })
      }
      this.carouselPageList = this.carouselPageList.concat(end);
    }
  }

}
