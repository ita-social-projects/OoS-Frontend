import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { IClass } from 'src/app/shared/models/category.model';
import { takeUntil } from 'rxjs/operators';
import { TechAdmin } from 'src/app/shared/models/techAdmin.model';


@Component({
  selector: 'app-add-class-form',
  templateUrl: './add-class-form.component.html',
  styleUrls: ['./add-class-form.component.scss']
})
export class AddClassFormComponent implements OnInit {

  classFormGroup: FormGroup;
  isActiveClassInfoButton = false;
  isActiveDepartmentInfoButton = false;
  isActiveDirectionInfoButton = false;
  editMode = false;


  @Input() admin: TechAdmin;
  //@Output() passDirectionFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.classFormGroup = this.formBuilder.group({
      className: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });
  }

  ngOnInit(): void {
    (this.admin) && this.classFormGroup.patchValue(this.admin, { emitEvent: false });
   // this.passDirectionFormGroup.emit(this.classFormGroup);
  }

  onSubmit(): void { }

  /**
   * This method receives a form and marks each control of this form as touched
   * @param FormGroup form
   */
   //private checkValidation(form: FormGroup): void {
   // Object.keys(form.controls).forEach(key => {
   // form.get(key).markAsTouched();
  //});
  //}



}




