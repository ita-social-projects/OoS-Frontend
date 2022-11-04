import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TruncatedItem } from '../../models/truncated.model';
import { DeclinationPipe } from '../../pipes/declination.pipe';

@Component({
  selector: 'app-entity-checkbox-dropdown',
  templateUrl: './entity-checkbox-dropdown.component.html',
  styleUrls: ['./entity-checkbox-dropdown.component.scss'],
  providers: [DeclinationPipe]
})
export class EntityCheckboxDropdownComponent implements OnInit, OnDestroy {
  entityControl = new FormControl();
  ids: string[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() entities: TruncatedItem[];
  @Input() declination;
  @Output() entityCheck = new EventEmitter<string[]>();
  Declination;

  constructor(private declinationPipe: DeclinationPipe) {}

  ngOnInit(): void {
    this.entityControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((entities) => {
      this.ids = entities.map((entity) => entity.id);
      this.entityCheck.emit(this.ids);
    });
    this.Declination = this.declination;
  }

  getlabelTitle(quantity: number): string {
    let allChildrenDeclination, allApplicationsDeclination;
    if (this.Declination) {
      allChildrenDeclination = this.Declination[4];
      allApplicationsDeclination = this.Declination[1];
    }
    const allEntities = allChildrenDeclination || allApplicationsDeclination;
    const selectedEntities = this.declinationPipe.transform(quantity, this.Declination);
    return quantity < 1 ? selectedEntities : `Усі ${allEntities}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
