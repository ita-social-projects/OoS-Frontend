import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Child } from 'src/app/shared/models/child.model';
import { ChangePage } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-parent-add-child',
  templateUrl: './parent-add-child.component.html',
  styleUrls: ['./parent-add-child.component.scss']
})
export class ParentAddChildComponent implements OnInit {

  public forms = [1];
  childrenFormArray = new FormArray([]);
  
  constructor( private store: Store, private fb : FormBuilder) {

   }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.childrenFormArray.push(this.newForm());
    
  }
  newForm(): FormGroup{
    const childFormGroup = this.fb.group({
      lastName: new FormControl(''),
      firstName: new FormControl(''), 
      secondName: new FormControl(''),
      birthDay: new FormControl(''),
    });
    return childFormGroup;
  }

  addChild(){
  this.childrenFormArray.push(this.newForm());
}
  deleteForm(index):void{
  this.childrenFormArray.removeAt(index)
}

onSubmit() {
  let child:Child;
  const children=[];
  
 for(let i = 0; i < this.childrenFormArray.length; i++){
  child = new Child(this.childrenFormArray.controls[i].value);

 }
  
}
}