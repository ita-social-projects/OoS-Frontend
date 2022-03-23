import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngxs/store';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { createDirectionSteps } from 'src/app/shared/enum/provider';
import { TechAdmin } from 'src/app/shared/models/techAdmin.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AdminState } from 'src/app/shared/store/admin.state';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-create-direction',
  templateUrl: './create-direction.component.html',
  styleUrls: ['./create-direction.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})

export class CreateDirectionComponent implements OnInit, OnDestroy {
  techAdmin: TechAdmin;

  directionFormGroup: FormGroup;
  departmentFormGroup: FormGroup;
  classFormGroup: FormGroup;

  editMode = false;

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private route: ActivatedRoute,
    private store: Store,) {

    }

  ngOnInit(): void {

  }
  
  ngAfterViewInit(): void {
    if (this.editMode) {
      this.route.params.subscribe((params: Params) => {
        this.stepper.selectedIndex = +createDirectionSteps[params.param];
      });
    }
  }

    /**
   * This method receives a form from create-info child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
     //onReceiveDirectionFormGroup(form: FormGroup): void {
     // this.directionFormGroup = form;
   // }

        /**
   * This method receives a form from create-info child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
   //      onReceiveDepartmentFormGroup(form: FormGroup): void {
    //      this.departmentFormGroup = form;
    //    }

            /**
   * This method receives a form from create-info child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
    // onReceiveClassFormGroup(form: FormGroup): void {
    //  this.classFormGroup = form;
   // }

  onSubmit(): void { }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
