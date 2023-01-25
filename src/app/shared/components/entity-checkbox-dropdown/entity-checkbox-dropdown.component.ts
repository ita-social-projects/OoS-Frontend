import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TruncatedItem } from '../../models/item.model';
import { TranslateCasesPipe } from '../../pipes/translate-cases.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-entity-checkbox-dropdown',
  templateUrl: './entity-checkbox-dropdown.component.html',
  styleUrls: ['./entity-checkbox-dropdown.component.scss'],
  providers: [TranslateCasesPipe],
})
export class EntityCheckboxDropdownComponent implements OnInit, OnDestroy {
  entityControl = new FormControl();
  ids: string[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() entities: TruncatedItem[];
  @Input() declination;
  @Input() labelByDefault;
  @Output() entityCheck = new EventEmitter<string[]>();
  Declination;

  constructor(private translateCases: TranslateCasesPipe, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.entityControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(entities => {
        this.ids = entities.map(entity => entity.id);
        this.entityCheck.emit(this.ids);
      });
    this.Declination = this.declination;
  }

  getLabelTitle(quantity: number): string {
    let allChildrenDeclination;
    let allApplicationsDeclination;

    if (this.Declination) {
      allChildrenDeclination =
        this.Declination[0] === 'ENUM.CHILD_DECLINATION.CHILD' ? this.translateService.instant('ALL_CHILDREN') : '';
      allApplicationsDeclination =
        this.Declination[0] === 'ENUM.WORKSHOP_DECLINATION.WORKSHOP'
          ? this.translateService.instant('ALL_WORKSHOPS')
          : '';
    }

    const allEntities = allChildrenDeclination || allApplicationsDeclination;
    const selectedEntities = this.translateCases.transform(quantity, this.Declination);
    return quantity < 1 ? selectedEntities : this.translateService.instant(this.labelByDefault) || allEntities;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
