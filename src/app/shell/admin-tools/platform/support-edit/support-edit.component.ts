import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants/constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-support-edit',
  templateUrl: './support-edit.component.html',
  styleUrls: ['./support-edit.component.scss']
})
export class SupportEditComponent implements OnInit, OnDestroy {

  readonly constants: typeof Constants = Constants;

  isActiveHeaderInfoButton = false;
  isActiveSectionInfoButton = false;
  
  supportEditFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private store: Store, 
    private navigationBarService: NavigationBarService) {

    this.supportEditFormGroup = this.fb.group({
      image: new FormControl(''),
      headerName: new FormControl('', Validators.required),
      sectionName: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.maxLength(Constants.MAX_DESCRIPTION_LENGTH), Validators.required]),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
      { name: NavBarName.AdminTools,
        // path: '/platform',
        isActive: false, disable: false },
      { name: NavBarName.Platform, isActive: false, disable: false },
      { name: NavBarName.Support, isActive: false, disable: true }
    )));
  }
  onSubmit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
