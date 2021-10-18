import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Constants, PaginationConstants } from '../../constants/constants';
import { PaginationElement } from '../../models/paginationElement.model';
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {

  readonly constants: typeof PaginationConstants = PaginationConstants;
  carouselPageList: PaginationElement[] = [];
  totalPageAmount: number;
  size: number = Constants.ITEMS_PER_PAGE;

  @Input() currentPage: PaginationElement;
  @Input() totalEntities: number;
  @Output() pageChange = new EventEmitter<PaginationElement>();

  constructor() { }

  ngOnInit(): void {
    this.totalPageAmount = this.getTotalPageAmount();

    this.createPageList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.currentPage) {
      if (!changes.currentPage.isFirstChange()) {
        const currentPage = this.carouselPageList.find((page: PaginationElement) => page.element === this.currentPage.element);
        const isForward: boolean = this.checkIsForwardScrollDirection(changes);
        const isRecreationAllowed: boolean = this.checkCarouseleRecreationIsAllowed(isForward, currentPage);

        if (isRecreationAllowed) {
          this.createPageList();
        }
      }

    }

  }

  private checkIsForwardScrollDirection(changes: SimpleChanges): boolean {
    return changes.currentPage.previousValue.element < changes.currentPage.currentValue.element;
  }

  private checkCarouseleRecreationIsAllowed(isForward: boolean, currentPage: PaginationElement): boolean {
    if (isForward) {
      return this.carouselPageList.indexOf(currentPage) >= this.constants.PAGINATION_SHIFT_DELTA;
    } else {
      return this.carouselPageList.indexOf(currentPage) <= this.constants.PAGINATION_SHIFT_DELTA;
    }
  }

  private createPageList(): void {
    this.carouselPageList = [];

    let firstPage = +this.currentPage.element - this.constants.PAGINATION_SHIFT_DELTA;
    firstPage = firstPage < this.constants.FIRST_PAGINATION_PAGE ? this.constants.FIRST_PAGINATION_PAGE : firstPage;

    let lastPage = +this.currentPage.element + this.constants.PAGINATION_SHIFT_DELTA;
    lastPage = lastPage > this.totalPageAmount ? this.totalPageAmount : lastPage;

    const pageList = this.createDisplayedPageList(firstPage);

    if (this.totalPageAmount < this.constants.MAX_PAGE_PAGINATOR_DISPLAY) {
      this.carouselPageList = pageList;
    } else {
      this.createCarouselPageList(pageList, pageList[0]?.element !== this.constants.FIRST_PAGINATION_PAGE, true);
    }

  }

  onPageChange(page: PaginationElement): void {
    this.pageChange.emit(page);
  }

  onArroveClick(isForward: boolean): void {
    const page: PaginationElement = {
      element: '',
      isActive: true,
    };
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
    let start: number;
    let end: number;
    if (this.totalPageAmount > this.constants.MAX_PAGE_PAGINATOR_DISPLAY) {
      const isMaxAmountFit = (startPage + this.constants.MAX_PAGE_PAGINATOR_DISPLAY) < this.totalPageAmount;
      start = (isMaxAmountFit) ? startPage : this.totalPageAmount - this.constants.MAX_PAGE_PAGINATOR_DISPLAY;
      end = this.constants.MAX_PAGE_PAGINATOR_DISPLAY;
    } else {
      start = startPage;
      end = this.totalPageAmount;
    }

    const pageList: PaginationElement[] = [];
    while (pageList.length < end) {
      pageList.push({
        element: start,
        isActive: true
      });
      start++;
    }
    return pageList;
  }

  private createCarouselPageList(pageList: PaginationElement[], isOnStart?: boolean, isOnEnd?: boolean): void {
    if (isOnStart) {
      let start: PaginationElement[] = [
        {
          element: this.constants.FIRST_PAGINATION_PAGE,
          isActive: true
        }
      ];

      if (pageList[0]?.element !== 2) {
        start.push(
          {
            element: this.constants.PAGINATION_DOTS,
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
      const end: PaginationElement[] = [
        {
          element: this.totalPageAmount,
          isActive: true
        }
      ];
      if (pageList[pageList.length - 1]?.element !== this.totalPageAmount - 1) {
        end.unshift({
          element: this.constants.PAGINATION_DOTS,
          isActive: false
        });
      }
      this.carouselPageList = this.carouselPageList.concat(end);
    }
  }

}
