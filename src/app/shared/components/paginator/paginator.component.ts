import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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
    this.createInitialPageList();
  }

  ngOnChanges() {

    if (this.carouselPageList.indexOf(this.currentPage) > this.PAGINATION_SHIFT_DELTA) {
      this.carouselPageList = [];

      let firstPage = +this.currentPage.element - this.PAGINATION_SHIFT_DELTA;
      let lastPage = +this.currentPage.element + this.PAGINATION_SHIFT_DELTA;

      let pageList = this.createDisplayedPageList(firstPage, lastPage);


      if (this.totalPageAmount < this.MAX_PAGE_PAGINATOR_DISPLAY) {
        this.carouselPageList = pageList;
      } else {
        this.createCarouselPageList(pageList, Boolean(firstPage > this.PAGINATION_SHIFT_DELTA), true);
      }
    }
  }

  onPageChange(page: PaginationElement) {
    this.pageChange.emit(page);
  }

  private createInitialPageList() {
    this.totalPageAmount = Math.ceil(this.totalEntities / this.MAX_PAGE_PAGINATOR_DISPLAY);

    let pageList = [];

    if (this.totalPageAmount < this.MAX_PAGE_PAGINATOR_DISPLAY) {
      pageList = this.createDisplayedPageList(this.FIRST_PAGINATION_PAGE, this.totalPageAmount);
      this.carouselPageList = pageList;
    } else {
      pageList = this.createDisplayedPageList(this.FIRST_PAGINATION_PAGE, this.MAX_PAGE_PAGINATOR_DISPLAY);
      this.createCarouselPageList(pageList, false, true);
    }
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
      const start = [
        {
          element: this.FIRST_PAGINATION_PAGE,
          isActive: true
        },
        {
          element: this.PAGINATION_DOTS,
          isActive: false
        }
      ];
      this.carouselPageList = this.carouselPageList.concat(start);
    };

    this.carouselPageList = this.carouselPageList.concat(pageList);

    if (isOnEnd) {
      const end = [
        {
          element: this.PAGINATION_DOTS,
          isActive: false
        },
        {
          element: this.totalPageAmount,
          isActive: true
        }
      ]
      this.carouselPageList = this.carouselPageList.concat(end);
    }
  }

}
