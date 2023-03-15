import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { TruncatedItem } from '../../models/item.model';
import { TranslateCasesPipe } from '../../pipes/translate-cases.pipe';

@Component({
  selector: 'app-entity-checkbox-dropdown',
  templateUrl: './entity-checkbox-dropdown.component.html',
  styleUrls: ['./entity-checkbox-dropdown.component.scss'],
  providers: [TranslateCasesPipe]
})
export class EntityCheckboxDropdownComponent implements OnInit, OnDestroy {
  @Input() entities: TruncatedItem[];
  @Input() declination;
  @Input() labelByDefault;
  @Input() entityControl: FormControl = new FormControl();
  @Output() entityCheck = new EventEmitter<string[]>();

  Declination;
  ids: string[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private translateCases: TranslateCasesPipe) {}

  ngOnInit(): void {
    this.entityControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((entities: TruncatedItem[]) => {
        this.ids = entities.map((entity) => entity.id);
        this.entityCheck.emit(this.ids);
      });
    this.Declination = this.declination;
  }

  getLabelTitle(quantity: number): string {
    let allChildrenDeclination;
    let allApplicationsDeclination;

    if (this.Declination) {
      allChildrenDeclination = this.Declination[0] === 'ENUM.CHILD_DECLINATION.CHILD' ? 'ALL_CHILDREN' : '';
      allApplicationsDeclination = this.Declination[0] === 'ENUM.WORKSHOP_DECLINATION.WORKSHOP' ? 'ALL_WORKSHOPS' : '';
    }

    const allEntities = allChildrenDeclination || allApplicationsDeclination;
    const selectedEntities = this.translateCases.transform(quantity, this.Declination);
    return quantity < 1 ? selectedEntities : this.labelByDefault || allEntities;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
