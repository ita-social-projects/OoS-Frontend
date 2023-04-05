import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin } from 'rxjs';
import { InstituitionHierarchy } from '../../../../../shared/models/institution.model';
import { InstitutionsService } from '../../../../../shared/services/institutions/institutions.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-directions-institution-hierarchies-edit-form',
  templateUrl: './directions-institution-hierarchies-edit-form.component.html',
  styleUrls: ['./directions-institution-hierarchies-edit-form.component.scss']
})
export class DirectionsInstitutionHierarchiesEditFormComponent implements OnInit, AfterViewInit {
  @ViewChild('editForm') editForm: ElementRef;
  editFormTitle: string = 'Редагувати напрямок';
  editFormSubtitle: string = 'Редагуйте новий напрямок';
  ministryLabel: string = 'Підпорядкування (Міністерство)';
  warningMsg: string = 'Зверніть увагу, що після зміни назви напрямку для всіх \n' +
    'інших залежних профілів також поміняється назва. ';
  userDirectionsLabel: string = 'Напрямки для користувача';

  EditDirectionFormGroup: FormGroup;
  allEdited: Observable<boolean>;
  fields: string[] = [];
  requests: Observable<InstituitionHierarchy>;
  editedInsHierarchies: InstituitionHierarchy[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private institutionService: InstitutionsService,
    private dialogRef: MatDialogRef<DirectionsInstitutionHierarchiesEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.buildForm();
   }

  ngOnInit(): void {
    console.log(this.data.element.insHierarchies[0].title);
  }

  ngAfterViewInit(): void {
    this.lastInputFocus();
  }

  buildForm() {
    const formGroupFields = this.getFormControlsFields();
    this.EditDirectionFormGroup = new FormGroup(formGroupFields);
  }

  getFormControlsFields() {
    const formGroupFields = {};
    formGroupFields[this.ministryLabel] = new FormControl({value: this.data.element.insHierarchies[0].institution.title, disabled: true});
    this.fields.push(this.ministryLabel);
    for (let i = 0; i < this.data.columns.length; ++i) {
      let field = this.data.columns[i];
      formGroupFields[field] = new FormControl(this.data.element.insHierarchies[i].title);
      this.fields.push(field);
    }
    return formGroupFields;
  }

  onSubmit() {
    for (let i = 0; i < this.data.columns.length; ++i) {
      const fieldName = this.data.columns[i];
      const field = this.EditDirectionFormGroup.controls[fieldName];
      if (field.value != this.data.element.name[i]) {
        let editedInsHierarchy = this.data.element.insHierarchies[i];
        editedInsHierarchy.title = field.value;
        this.editedInsHierarchies.push(editedInsHierarchy);
      }
    }

    forkJoin(
      this.editedInsHierarchies.map(ins => this.editInstitutionalHierarchy(ins))).subscribe((result) => {
        this.closeDialog();
        this.reloadPage();
    });

  }

  lastInputFocus() {
    let inputs = this.editForm.nativeElement.getElementsByTagName('input') as HTMLInputElement[];
    let lastInput = inputs[inputs.length - 1];
    lastInput.focus();
  }

  editInstitutionalHierarchy(insHierarchy: InstituitionHierarchy): Observable<InstituitionHierarchy> {
    return this.institutionService.editInstitutionHierarchy(insHierarchy);
  }

  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
