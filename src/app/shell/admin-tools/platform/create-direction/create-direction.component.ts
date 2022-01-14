import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-create-direction',
  templateUrl: './create-direction.component.html',
  styleUrls: ['./create-direction.component.scss']
})
export class CreateDirectionComponent implements OnInit, OnDestroy {

  directionFormGroup: FormGroup;

  editMode = false;

  isActiveDirectionInfoButton = false;
  isActiveSectionInfoButton = false;
  isActiveClassInfoButton = false;

  constructor(
    private fb: FormBuilder,
    private store: Store, 
    private navigationBarService: NavigationBarService) { 
      
      this.directionFormGroup = this.fb.group({
        image: new FormControl(''),
        directionName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
        sectionName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
        className: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      });
    }

  ngOnInit(): void {
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
      { name: NavBarName.AdminTools, isActive: false, disable: false },
      { name: NavBarName.Platform, isActive: false, disable: false },
      { name: NavBarName.Direction, isActive: false, disable: true }
    )));
  }

  onSubmit(): void { }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
