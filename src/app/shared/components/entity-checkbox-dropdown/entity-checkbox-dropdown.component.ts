import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ChildDeclination, WorkshopDeclination } from '../../enum/enumUA/declinations/declination';
import { TruncatedItem } from '../../models/item.model';
import { TranslateCasesPipe } from '../../pipes/translate-cases.pipe';

@Component({
  selector: 'app-entity-checkbox-dropdown',
  templateUrl: './entity-checkbox-dropdown.component.html',
  styleUrls: ['./entity-checkbox-dropdown.component.scss'],
  providers: [TranslateCasesPipe]
})
export class EntityCheckboxDropdownComponent implements OnInit, OnDestroy {
  @Input() public entities: TruncatedItem[];
  @Input() public declination: WorkshopDeclination | ChildDeclination;
  @Input() public labelByDefault: string;
  @Input() public entityControl: FormControl = new FormControl();
  @Output() public entityCheck = new EventEmitter<string[]>();
  @Output() public change = new EventEmitter<string[]>();

  private ids: string[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private userInteracted = false;

  constructor(private translateCases: TranslateCasesPipe) {}

  public ngOnInit(): void {
    this.entityControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((entities: TruncatedItem[]) => {
        this.ids = entities.map((entity) => entity.id);
        this.entityCheck.emit(this.ids);

        if (this.userInteracted) {
          this.change.emit();
        }
      });
  }

  public getLabelTitle(quantity: number): string {
    let allChildrenDeclination: string;
    let allApplicationsDeclination: string;

    if (this.declination) {
      allChildrenDeclination = this.declination[0] === 'ENUM.CHILD_DECLINATION.CHILD' ? 'ALL_CHILDREN' : '';
      allApplicationsDeclination = this.declination[0] === 'ENUM.WORKSHOP_DECLINATION.WORKSHOP' ? 'ALL_WORKSHOPS' : '';
    }

    const allEntities = allChildrenDeclination || allApplicationsDeclination;
    const selectedEntities = this.translateCases.transform(quantity, this.declination);
    return quantity < 1 ? selectedEntities : this.labelByDefault || allEntities;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
