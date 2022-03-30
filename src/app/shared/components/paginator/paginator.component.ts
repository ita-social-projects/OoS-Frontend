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

  @Input() currentPage: PaginationElement;
  @Input() totalEntities: number;
  @Input() totalEntitiesDir: number;

  @Output() pageChange = new EventEmitter<PaginationElement>();

  carouselPageList: PaginationElement[] = [];
  totalPageAmount: number;

  constructor() { }

  ngOnInit(): void {
    this.totalPageAmount = this.getTotalPageAmount();
    this.createPageList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.currentPage) {
      if (!changes.currentPage.isFirstChange()) {
        this.createPageList();
      }
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

  private createPageList(): void {
    this.carouselPageList = [];
    const pageList = this.createDisplayedPageList();

    this.createCarouselPageList(pageList);
  }

  private getTotalPageAmount(): number {
    return Math.ceil(this.totalEntities / Constants.ITEMS_PER_PAGE)|| Math.ceil(this.totalEntities / Constants.ITEMS_PER_PAGE_DIR);
  }

  private createDisplayedPageList(): PaginationElement[] {
    let startPage = +this.currentPage.element - this.constants.PAGINATION_SHIFT_DELTA;
    startPage = startPage < this.constants.FIRST_PAGINATION_PAGE ? this.constants.FIRST_PAGINATION_PAGE : startPage;

    const carouselLength = this.constants.MAX_PAGE_PAGINATOR_DISPLAY + startPage - 1;

    let endPage = (carouselLength <= this.totalPageAmount) ? carouselLength : this.totalPageAmount;

    const pageList: PaginationElement[] = [];

    while (startPage < endPage + 1) {
      pageList.push({
        element: startPage,
        isActive: true
      }); startPage++;
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
