import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IClass } from 'src/app/shared/models/category.model';

@Component({
  selector: 'app-classes-check-box-list',
  templateUrl: './classes-check-box-list.component.html',
  styleUrls: ['./classes-check-box-list.component.scss']
})
export class ClassesCheckBoxListComponent implements OnInit {

  @Input() classes: IClass[];
  @Input() ClassFormGroup: FormGroup;
  selectedIClasses: IClass[] = [];
  editOptionRadioBtn: FormControl = new FormControl(false);


  @Output() iClassCheck = new EventEmitter<number[]>();

  destroy$: Subject<boolean> = new Subject<boolean>();


  get classIdControl(): AbstractControl { return this.ClassFormGroup && this.ClassFormGroup.get('classId'); }


  constructor() { }

  ngOnInit(): void {
  }
  onDelete(): void {
  }

  

  oniClassCheck(iClass: IClass, event: MatCheckbox): void {
    (event.checked) ? this.selectedIClasses.push(iClass) : this.selectedIClasses.splice(this.selectedIClasses.findIndex((selectedIClasses: IClass) => selectedIClasses.id === iClass.id), 1);
    //this.store.dispatch(new SetDirections(this.selectedDirections));
  }

  onSelectCheck(value: IClass): boolean {
    const result = this.selectedIClasses
      .some(iClass => iClass.title.startsWith(value.title)
      );
    return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
