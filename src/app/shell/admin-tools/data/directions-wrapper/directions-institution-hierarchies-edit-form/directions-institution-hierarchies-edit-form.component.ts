import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, forkJoin, asyncScheduler } from 'rxjs';
import { InstituitionHierarchy } from '../../../../../shared/models/institution.model';
import { GetAllInstitutionsHierarchy, GetDirections, UpdateInstitutionHierarchy } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { Direction } from '../../../../../shared/models/category.model';
import { DataItem } from '../../../../../shared/models/item.model';
import { EditInsHierarchyModel } from '../edit-ins-hierarchy-model';

@Component({
  selector: 'app-directions-institution-hierarchies-edit-form',
  templateUrl: './directions-institution-hierarchies-edit-form.component.html',
  styleUrls: ['./directions-institution-hierarchies-edit-form.component.scss']
})
export class DirectionsInstitutionHierarchiesEditFormComponent implements AfterViewInit {
  @Select(MetaDataState.directions) public directions$: Observable<Direction[]>;

  @ViewChild('editForm') private editForm: ElementRef;
  @ViewChild('select') private select: MatSelect;

  public readonly ministryControl: string = 'Ministry';
  public readonly userDirectionsControl: string = 'USER_DIRECTIONS';

  public editDirectionFormGroup: FormGroup;
  public directionsControl: FormControl = new FormControl([]);
  public fields: string[] = [];

  private lastInsHierarchy: InstituitionHierarchy;
  private editedInsHierarchies: InstituitionHierarchy[] = [];

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<DirectionsInstitutionHierarchiesEditFormComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: EditInsHierarchyModel
  ) {
    this.store.dispatch(new GetDirections());
    this.lastInsHierarchy = this.getLastInsHierarchy();
    this.buildForm();
  }

  public ngAfterViewInit(): void {
    asyncScheduler.schedule(() => {
      if (this.editForm) {
        this.lastInputFocus();
      }
    }, 0);
  }

  public onCancel(): void {
    this.closeDialog();
  }

  public onSubmit(): void {
    for (let i = 0; i < this.data.columns.length; ++i) {
      const fieldName = this.data.columns[i];
      const field = this.editDirectionFormGroup.controls[fieldName];
      if (field.value !== this.data.element.name[i]) {
        const editedInsHierarchy = this.data.element.insHierarchies[i];
        editedInsHierarchy.title = field.value;
        this.editedInsHierarchies.push(editedInsHierarchy);
      }
    }

    if (!this.compareTwoArrays(this.directionsControl.value, this.lastInsHierarchy.directions)) {
      let editedInsHierarchy = this.editedInsHierarchies.find((ins: InstituitionHierarchy) => ins.id === this.lastInsHierarchy.id);
      if (editedInsHierarchy) {
        editedInsHierarchy.directions = this.directionsControl.value;
      } else {
        editedInsHierarchy = this.lastInsHierarchy;
        editedInsHierarchy.directions = this.directionsControl.value;
        this.editedInsHierarchies.push(editedInsHierarchy);
      }
    }

    forkJoin(this.editedInsHierarchies.map((ins: InstituitionHierarchy) => this.editInstitutionalHierarchy(ins))).subscribe((result) => {
      this.store.dispatch(new GetAllInstitutionsHierarchy());
      this.reloadPage();
    });

    this.closeDialog();
  }

  public compareItems(item1: DataItem, item2: DataItem): boolean {
    return item1.id === item2.id;
  }

  public onRemoveItem(direction: DataItem): void {
    this.directionsControl.value.splice(this.directionsControl.value.indexOf(direction), 1);
    this.select.options.find((option: MatOption) => option.value.id === direction.id).deselect();
  }

  private buildForm(): void {
    const directions = [...this.lastInsHierarchy.directions];
    const formGroupFields = this.getFormControlsFields();
    formGroupFields[this.userDirectionsControl] = new FormControl(directions);
    this.editDirectionFormGroup = new FormGroup(formGroupFields);
    this.directionsControl = this.editDirectionFormGroup.get(this.userDirectionsControl) as FormControl;
  }

  private getLastInsHierarchy(): InstituitionHierarchy {
    return this.data.element.insHierarchies[this.data.element.insHierarchies.length - 1];
  }

  private getFormControlsFields(): any {
    const formGroupFields = {};
    formGroupFields[this.ministryControl] = new FormControl({
      value: this.data.element.insHierarchies[0].institution.title,
      disabled: true
    });
    this.fields.push(this.ministryControl);
    let field;
    let title;
    for (let i = 0; i < this.data.columns.length; ++i) {
      field = this.data.columns[i];
      title = this.data.element.insHierarchies[i]?.title;
      if (title) {
        formGroupFields[field] = new FormControl(title);
      } else {
        formGroupFields[field] = new FormControl({ value: null, disabled: true });
      }
      this.fields.push(field);
    }
    return formGroupFields;
  }

  private editInstitutionalHierarchy(insHierarchy: InstituitionHierarchy): Observable<InstituitionHierarchy | Observable<void>> {
    return this.store.dispatch(new UpdateInstitutionHierarchy(insHierarchy));
  }

  private lastInputFocus(): void {
    const inputs = this.editForm.nativeElement.getElementsByTagName('input') as HTMLInputElement[];
    const lastInput = inputs[inputs.length - 1];
    lastInput.focus();
  }

  private reloadPage(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }

  private compareTwoArrays(array1: Direction[], array2: Direction[]): boolean {
    return (
      array1.length === array2.length &&
      array1.every((first: Direction) => array2.some((second: Direction) => Object.keys(first).every((key) => first[key] === second[key])))
    );
  }
}
