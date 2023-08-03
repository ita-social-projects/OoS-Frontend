import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AddInsHierarchyModel } from './add-ins-hierarchy-model';
import { FormControl, FormGroup } from '@angular/forms';
import { DataItem } from 'shared/models/item.model';
import { InstituitionHierarchy } from 'shared/models/institution.model';

export interface Field {
  name: string;
  isVisible: boolean;
  options?: InstituitionHierarchy[];
}

@Component({
  selector: 'app-directions-institution-hierarchies-add-form',
  templateUrl: './directions-institution-hierarchies-add-form.component.html',
  styleUrls: ['./directions-institution-hierarchies-add-form.component.scss']
})

export class DirectionsInstitutionHierarchiesAddFormComponent implements OnInit, AfterViewInit {

  readonly ministryControl: string = 'Ministry';
  readonly userDirectionsControl: string = 'USER_DIRECTIONS';

  private currentLevel: number = 1;
  private levelsNumber: number;
  public addDirectionFormGroup: FormGroup;
  public directionsControl: FormControl = new FormControl([]);
  public isVisible: boolean[] = [];
  public fields: Field[] = [];


  constructor(private router: Router, private dialogRef: MatDialogRef<DirectionsInstitutionHierarchiesAddFormComponent>,
    private store: Store, @Inject(MAT_DIALOG_DATA) public data: AddInsHierarchyModel) { 
    this.levelsNumber = this.getLevelsNumber();
    this.createDefaultIsVisibleArray(this.levelsNumber);
    this.buildForm();
   }

  ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    //this.buildForm();
  }

  private getLevelsNumber() {
    let maxLevel = this.data.columns.length;
    return maxLevel;
  }

  private createDefaultIsVisibleArray(levelsNumber) {
    this.isVisible.push(true);
    for (let i = 1; i < levelsNumber; ++i) {
      this.isVisible.push(false);
    } 
  }

  private getFormControlsFields(): any {
    const formGroupFields = {};
    formGroupFields[this.ministryControl] = new FormControl({value: this.data.institution.title, disabled: true});
    this.fields.push({name: this.ministryControl, isVisible: true});
    let field, title;
    for (let i = 0; i < this.data.columns.length; ++i) {
      field = {name: this.data.columns[i], isVisible: i < this.currentLevel ? true : false};
      if (i === 0) {
        field.options = this.getFirstLevelHierarchies();
      }
      // if (title) {
      //   formGroupFields[field] = new FormControl(title);
      // }
      // else {
      //   formGroupFields[field] = new FormControl({value: null, disabled: true});
      // }
      formGroupFields[field.name] = new FormControl();
      this.fields.push(field);
    }
    return formGroupFields;
  }

  private buildForm(): void {
    const formGroupFields = this.getFormControlsFields();
    //formGroupFields[this.userDirectionsControl] = new FormControl(directions);
    this.addDirectionFormGroup = new FormGroup(formGroupFields);
    //this.directionsControl = this.addDirectionFormGroup.get(this.userDirectionsControl) as FormControl;
  }

  public compareItems(item1: DataItem, item2: DataItem): boolean {
    return item1.id === item2.id;
  }

  public getFirstLevelHierarchies() {
    let insHierarchies = this.data.allInsHierarchies.filter(ins => ins.hierarchyLevel === 1);
    return insHierarchies;
  }

  public getChildren(id): InstituitionHierarchy[] {
    let children = this.data.allInsHierarchies.filter(ins => ins.parentId === id);
    return children;
  }

  public getCurrentLevelHierarchies() {
    let currentLevelInsHierarchies = this.data.allInsHierarchies.find(ins => ins.hierarchyLevel === this.currentLevel);
    this.currentLevel++;
    return currentLevelInsHierarchies;
  }

  public changeLevel(event, field) {
    let fieldIndex = this.fields.indexOf(field);
    if (fieldIndex < this.currentLevel) {
      this.makeLowerLevelsInvisible(fieldIndex);
      this.currentLevel = fieldIndex + 1;
    }
    if (fieldIndex === this.currentLevel) {
      this.fields[this.currentLevel + 1].isVisible = true;
      this.currentLevel++;
    }
    this.fields[fieldIndex + 1].options = this.getChildren(event.id);
  }

  public makeLowerLevelsInvisible(index) {
    for (var i = index + 2; i < this.fields.length; ++i) {
      this.fields[i].isVisible = false;
    }
  }

  public onSubmit() {}
  
  public onCancel() {}
}
