import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ENTER } from '@angular/cdk/keycodes';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Constants } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss']
})
export class CreateDescriptionFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  @Input() workshop: Workshop;
  @Output() passDescriptionFormGroup = new EventEmitter();

  DescriptionFormGroup: FormGroup;

  keyWordsCtrl: FormControl = new FormControl('', Validators.required);
  separatorKeysCodes: number[] = [ENTER];
  keyWords: string[] = [];
  keyWord: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;

  disabilityOptionRadioBtn: FormControl = new FormControl(false);
  
  constructor(private formBuilder: FormBuilder) {
    this.DescriptionFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: new FormControl('', [Validators.maxLength(Constants.MAX_DESCRIPTION_LENGTH), Validators.required]),
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }),
      head: new FormControl('', Validators.required),
      keyWords: new FormControl('', Validators.required),
      directionId: new FormControl(''),
      departmentId: new FormControl(''),
      classId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
    this.workshop && this.DescriptionFormGroup.patchValue(this.workshop, { emitEvent: false });
  }

  /**
   * This method remove already added key words from the list of key words
   * @param string word
   */
  onRemoveKeyWord(word: string): void {
    if (this.keyWords.indexOf(word) >= 0) {
      this.keyWords.splice(this.keyWords.indexOf(word), 1);
      if (this.keyWords.length) {
        this.DescriptionFormGroup.get('keyWords').setValue([...this.keyWords]);
      } else {
        this.DescriptionFormGroup.get('keyWords').reset();
      }
    }
  }
  
   onKeyWordsInput(event:KeyboardEvent):void{
    let inputKeyWord = this.keyWord.trim().toLowerCase();
    if (this.keyWord.trim() !== '' && !this.keyWords.includes(inputKeyWord)) {
      this.keyWords.push(inputKeyWord);
      this.DescriptionFormGroup.get('keyWords').setValue([...this.keyWords]);
      this.keyWordsInput.nativeElement.value = '';
      this.keyWordsCtrl.setValue(null);
      this.keyWord='';
    } else {
      this.keyWordsInput.nativeElement.value = '';
      this.keyWord = '';
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }



  onReceiveCategoriesFormGroup(categoriesForm: FormGroup): void {
    categoriesForm.get('directionId').valueChanges.subscribe((id: number) =>
      this.DescriptionFormGroup.get('directionId').setValue(id)
    )
    categoriesForm.get('departmentId').valueChanges.subscribe((id: number) =>
      this.DescriptionFormGroup.get('departmentId').setValue(id)
    )
    categoriesForm.get('classId').valueChanges.subscribe((id: number) =>
      this.DescriptionFormGroup.get('classId').setValue(id)
    )
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  onDisabilityOptionCtrlInit(): void {
    this.disabilityOptionRadioBtn.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((isDisabilityOptionsDesc: boolean) => {
        isDisabilityOptionsDesc ? this.DescriptionFormGroup.get('disabilityOptionsDesc').enable() : this.DescriptionFormGroup.get('disabilityOptionsDesc').disable();
      });

    this.DescriptionFormGroup.get('disabilityOptionsDesc').valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
      ).subscribe((disabilityOptionsDesc: string) =>
        this.DescriptionFormGroup.get('disabilityOptionsDesc').setValue(disabilityOptionsDesc)
      );
  }
}
