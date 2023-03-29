import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-directions-institution-hierarchies-edit-form',
  templateUrl: './directions-institution-hierarchies-edit-form.component.html',
  styleUrls: ['./directions-institution-hierarchies-edit-form.component.scss']
})
export class DirectionsInstitutionHierarchiesEditFormComponent implements OnInit {
  //@Inject(MAT_DIALOG_DATA) public data: any;

  editFormTitle: string = 'Редагувати напрямок';
  editFormSubtitle: string = 'Редагуйте новий напрямок';
  ministryLabel: string = 'Підпорядкування (Міністерство)';
  warningMsg: string = 'Зверніть увагу, що після зміни назви напрямку для всіх \n' +
    'інших залежних профілів також поміняється назва. ';
  userDirectionsLabel: string = 'Напрямки для користувача';

  EditDirectionFormGroup: FormGroup;
  fields: string[] = [];

  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.buildForm();
    // this.EditDirectionFormGroup = this.formBuilder.group({
    //   ministry: new FormControl(this.data.element.insHierarchies[0].institution.title),
    // });

   }

  ngOnInit(): void {
    console.log(this.data.element.insHierarchies[0].title);
  }

  buildForm() {
    const formGroupFields = this.getFormControlsFields();
    this.EditDirectionFormGroup = new FormGroup(formGroupFields);
  }

  getFormControlsFields() {
    const formGroupFields = {};
    formGroupFields[this.ministryLabel] = new FormControl(this.data.element.insHierarchies[0].institution.title);
    this.fields.push(this.ministryLabel);
    for (let i = 0; i < this.data.columns.length; ++i) {
        let field = this.data.columns[i];
        formGroupFields[field] = new FormControl(this.data.element.insHierarchies[i].title);
        this.fields.push(field);
    }
    return formGroupFields;
 }

}
