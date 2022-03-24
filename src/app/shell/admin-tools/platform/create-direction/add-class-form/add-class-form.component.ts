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
import { Constants } from 'src/app/shared/constants/constants';


@Component({
  selector: 'app-add-class-form',
  templateUrl: './add-class-form.component.html',
  styleUrls: ['./add-class-form.component.scss']
})
export class AddClassFormComponent implements OnInit {

  @Input() classFormGroup: FormGroup;

  @Output() deleteForm = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.classFormGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.maxLength(Constants.MAX_TEACHER_DESCRIPTION_LENGTH), Validators.required])
    });
  }


  ngOnInit(): void { }


}
