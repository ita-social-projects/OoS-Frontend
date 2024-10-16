import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  @Output() public userInteraction = new EventEmitter<string[]>();

  private ids: string[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private isUserInteracted = false;

  constructor(private translateCases: TranslateCasesPipe) {}

  public ngOnInit(): void {
    // TODO: Find better workaround for FormControl disable
    if (this.entities?.length < 1) {
      this.entityControl.disable({ emitEvent: false });
    }

    this.entityControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((entities: TruncatedItem[]) => {
        this.ids = entities.map((entity) => entity.id);
        this.entityCheck.emit(this.ids);

        if (this.isUserInteracted) {
          this.userInteraction.emit();
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

  public setIsUserInteractedToTrue(): void {
    this.isUserInteracted = true;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
