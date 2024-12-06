import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatChipSet } from '@angular/material/chips';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DATE_REGEX } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { DataItem } from 'shared/models/item.model';
import { GetSocialGroup } from 'shared/store/meta-data.actions';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss']
})
export class ChildFormComponent implements OnInit, OnDestroy {
  @Input()
  public ChildFormGroup: AbstractControl;
  @Input()
  public index: number;
  @Input()
  public childrenAmount: number;
  @Input()
  public socialGroups: DataItem[];

  @Output()
  public deleteForm = new EventEmitter();

  @ViewChild('select')
  private select: MatSelect;

  @ViewChild('chipSet')
  private chipSet: MatChipSet;
  public readonly validationConstants = ValidationConstants;

  public socialGroupControl: FormControl = new FormControl([]);
  public dateFilter: RegExp = DATE_REGEX;
  // TODO: Check the maximum allowable date in this case
  public maxDate: Date = Util.getTodayBirthDate();
  public minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  private readonly NONE_SOCIAL_GROUP_ID = 6;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private translateService: TranslateService,
    private store: Store
  ) {}

  public get ChildForm(): FormGroup {
    return this.ChildFormGroup as FormGroup;
  }

  public ngOnInit(): void {
    this.socialGroupControl = this.ChildFormGroup.get('socialGroups') as FormControl;

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(({ lang }: LangChangeEvent) => {
      this.store.dispatch(new GetSocialGroup(lang));
      this.chipSet._chips.forEach((chip) => {
        chip.remove();
      });
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method remove selected option from formControl
   * @param group SocialGroup
   */
  public onRemoveItem(group: DataItem): void {
    this.socialGroupControl.value.splice(this.socialGroupControl.value.indexOf(group), 1);
    this.select.options.find((option: MatOption) => option.value.id === group.id).deselect();
  }

  /**
   * This method disabled option if there is selected value in social group form control and this value is None
   * @param option SocialGroup
   */
  public checkDisabled(option: DataItem): boolean {
    if (!this.socialGroupControl.value.length) {
      return false;
    } else {
      const isNoneValueSelected = this.socialGroupControl.value.some((group: DataItem) => group.id === this.NONE_SOCIAL_GROUP_ID);
      return option.id === this.NONE_SOCIAL_GROUP_ID ? !isNoneValueSelected : isNoneValueSelected;
    }
  }

  public compareSocialGroups(group: DataItem, group2: DataItem): boolean {
    return group.id === group2.id;
  }

  public onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
