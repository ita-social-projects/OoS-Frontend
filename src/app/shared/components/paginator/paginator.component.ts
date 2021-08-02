import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() currentPage: number;
  @Input() totalPageAmount: number;

  pageList: number[] = [];

  @Output() pageChange = new EventEmitter<number>();


  constructor() { }

  ngOnInit(): void {
    this.createPageList();
  }

  ngOnChanges() {
    if (this.pageList.indexOf(this.currentPage) > Constants.MAX_PAGE_PAGINATOR_DISPLAY - 2) {
      this.createPageList();
    }
    if (this.pageList.indexOf(this.currentPage) < Constants.MAX_PAGE_PAGINATOR_DISPLAY - 5) {
      this.createPageList();
    }
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onNextPage() {
    const page = this.currentPage++;
    this.pageChange.emit(page);
  }

  onPreviousPage() {
    const page = this.currentPage--;
    this.pageChange.emit(page);
  }

  private createPageList() {
    this.pageList = [];
    let i: number = this.currentPage;
    while (i < this.totalPageAmount + 1 && i < Constants.MAX_PAGE_PAGINATOR_DISPLAY + this.currentPage) {
      this.pageList.push(i);
      i++;
    }
  }

}
