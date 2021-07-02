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

  keyWordsCtrl: FormControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER];
  keyWords: string[] = [];
  keyWord: string;
  destroy$: Subject<boolean> = new Subject<boolean>();



  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.DescriptionFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: new FormControl('', [Validators.maxLength(Constants.MAX_DESCRIPTION_LENGTH), Validators.required]),
      disabilityOptionsDesc: new FormControl(''),
      head: new FormControl('', Validators.required),
      keyWords: new FormControl(''),
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

    }
  }

  /**
   * This method adds an option from the list of filtered words
   * to the list of added by user key words
   * @param MatAutocompleteSelectedEvent value
   */
   onKeyWordsInput(event:KeyboardEvent):void{
    let inputKeyWord=this.keyWord.trim().toLowerCase();
    if(this.keyWord.trim()!=='' && !this.keyWords.includes(inputKeyWord)){
      this.keyWords.push(inputKeyWord);
      this.DescriptionFormGroup.get('keyWords').setValue(this.keyWords);
      this.keyWordsInput.nativeElement.value = '';
      this.keyWordsCtrl.setValue(null);
      this.keyWord='';
    }
    else{
      this.keyWordsInput.nativeElement.value = '';
      this.keyWord='';

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
}
