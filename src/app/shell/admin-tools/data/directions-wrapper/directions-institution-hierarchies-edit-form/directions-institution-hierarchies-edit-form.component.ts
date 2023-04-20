import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, forkJoin } from 'rxjs';
import { InstituitionHierarchy } from '../../../../../shared/models/institution.model';
import { InstitutionsService } from '../../../../../shared/services/institutions/institutions.service';
import { NavigationEnd, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { GetAllInstitutionsHierarchy, GetDirections } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { Direction } from '../../../../../shared/models/category.model';
import { DataItem } from '../../../../../shared/models/item.model';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-directions-institution-hierarchies-edit-form',
  templateUrl: './directions-institution-hierarchies-edit-form.component.html',
  styleUrls: ['./directions-institution-hierarchies-edit-form.component.scss']
})
export class DirectionsInstitutionHierarchiesEditFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('institution-hierarchies-table') insHierarchiesTable: ElementRef;
  @ViewChild('select') select: MatSelect;

  @Select(MetaDataState.directions) directions$: Observable<Direction[]>;

  editFormTitle: string = 'Редагувати напрямок';
  editFormSubtitle: string = 'Редагуйте новий напрямок';
  ministryLabel: string = 'Підпорядкування (Міністерство)';
  warningMsg: string = 'Зверніть увагу, що після зміни назви напрямку для всіх \n' +
    'інших залежних профілів також поміняється назва. ';
  userDirectionsLabel: string = 'Напрямки для користувача';

  EditDirectionFormGroup: FormGroup;
  directionsControl: FormControl = new FormControl([]);
  directions: Direction[];
  lastInsHierarchy: InstituitionHierarchy;
  allEdited: Observable<boolean>;
  fields: string[] = [];
  requests: Observable<InstituitionHierarchy>;
  editedInsHierarchies: InstituitionHierarchy[] = [];
  someSubscription: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private institutionService: InstitutionsService,
    private dialogRef: MatDialogRef<DirectionsInstitutionHierarchiesEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) {
    this.store.dispatch(new GetDirections());
    this.lastInsHierarchy = this.getLastInsHierarchy();
    //this.directions = this.getDirections();
    this.buildForm();
   }

  ngOnInit(): void {
    this.directionsControl = this.EditDirectionFormGroup.get(this.userDirectionsLabel) as FormControl;
    console.log(this.data.element.insHierarchies[0].title);
    console.log("table : " + JSON.stringify(this.insHierarchiesTable));
  }

  ngAfterViewInit(): void {
    this.lastInputFocus();
  }

  buildForm() {
    const formGroupFields = this.getFormControlsFields();
    formGroupFields[this.userDirectionsLabel] = new FormControl(this.lastInsHierarchy.directions);
    this.EditDirectionFormGroup = new FormGroup(formGroupFields);
  }

  getDirections() {
    let lastInsHierarchy = this.data.element.insHierarchies[this.data.element.insHierarchies.length - 1];
    return lastInsHierarchy.directions;
  }

  getLastInsHierarchy() {
    return this.data.element.insHierarchies[this.data.element.insHierarchies.length - 1];
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

    if (this.directionsControl.value != this.lastInsHierarchy.directions) {
      let editedInsHierarchy = this.editedInsHierarchies.find(ins => ins.id === this.lastInsHierarchy.id);
      if (editedInsHierarchy) {
        editedInsHierarchy.directions = this.directionsControl.value;
      }
      else {
        editedInsHierarchy = this.lastInsHierarchy;
        editedInsHierarchy.directions = this.directionsControl.value;
        this.editedInsHierarchies.push(editedInsHierarchy);
      }
    }

    forkJoin(
      this.editedInsHierarchies.map(ins => this.editInstitutionalHierarchy(ins))).subscribe((result) => {
        this.store.dispatch(new GetAllInstitutionsHierarchy());
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

  onRemoveItem(direction: DataItem): void {
    this.directionsControl.value.splice(this.directionsControl.value.indexOf(direction), 1);
    this.select.options.find((option: MatOption) => option.value.id === direction.id).deselect();
  }

  // checkDisabled(option: DataItem): boolean {
  //   if (!this.directionsControl.value.length) {
  //     return false;
  //   } else {
  //     const isNoneValueSelected = this.directionsControl.value.some((group: DataItem) => group.id === this.NONE_SOCIAL_GROUP_ID);
  //     return option.id === this.NONE_SOCIAL_GROUP_ID ? !isNoneValueSelected : isNoneValueSelected;
  //   }
  // }

  compareDirections(direction: DataItem, direction2: DataItem): boolean {
    return direction.id === direction2.id;
  }

  ngOnDestroy() {
  }
}
