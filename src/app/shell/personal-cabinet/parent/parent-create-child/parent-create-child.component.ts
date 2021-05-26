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

  ChildrenFormArray = new FormArray([]);

  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.ChildrenFormArray.push(this.newForm());
  }

  /**
  * This method create new FormGroup
  * @param FormArray array
  */
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

  /**
  * This method create new FormGroup add new FormGroup to the FormArray
  */
  addChild() {
    this.ChildrenFormArray.push(this.newForm());
  }

  /**
  * This method delete FormGroup from teh FormArray by index
  * @param index
  */
  onDeleteForm(index): void {
    this.ChildrenFormArray.removeAt(index)
  }

  /**
  * This method create CHild and distpatch CreateChild action
  */
  onSubmit() {
    for (let i = 0; i < this.ChildrenFormArray.controls.length; i++) {
      let child: Child = new Child(this.ChildrenFormArray.controls[i].value);
      this.store.dispatch(new CreateChildren(child))
    }
  }
}