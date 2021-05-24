import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Child } from 'src/app/shared/models/child.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { CreateChildren } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-parent-create-child',
  templateUrl: './parent-create-child.component.html',
  styleUrls: ['./parent-create-child.component.scss']
})
export class ParentCreateChildComponent implements OnInit {

  childrenFormArray = new FormArray([]);

  constructor(private store: Store, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.childrenFormArray.push(this.newForm());

  }
  newForm(): FormGroup {
    const childFormGroup = this.fb.group({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      birthDay: new FormControl(''),
      gender: new FormControl(''),
      type: new FormControl('')

    });
    return childFormGroup;
  }

  addChild() {
    this.childrenFormArray.push(this.newForm());
  }
  deleteForm(index): void {
    this.childrenFormArray.removeAt(index)
  }

  onSubmit() {
    for (let i = 0; i < this.childrenFormArray.controls.length; i++) {
      let child: Child = new Child(this.childrenFormArray.controls[i].value);
      this.store.dispatch(new CreateChildren(child))
    }
  }
}