import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Ordering } from 'shared/enum/ordering';
import { FilterList } from 'shared/models/filter-list.model';
import { SetOrder } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent {
  @Select(FilterState.filterList)
  protected filterList$: Observable<FilterList>;

  public readonly Ordering = Ordering;

  constructor(
    private store: Store,
    protected translateService: TranslateService
  ) {}

  public onSelectOption(event: MatSelectChange): void {
    this.store.dispatch(new SetOrder(event.value));
  }
}
