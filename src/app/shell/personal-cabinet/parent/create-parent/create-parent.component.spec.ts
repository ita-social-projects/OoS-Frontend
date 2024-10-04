import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { CreateParent } from 'shared/store/parent.actions';
import { CreateParentComponent } from './create-parent.component';

describe('CreateParentComponent', () => {
  let component: CreateParentComponent;
  let fixture: ComponentFixture<CreateParentComponent>;
  let fb: FormBuilder;
  let store: Store;
  let expectingMatDialogData: object;
  let matDialogSpy: jest.SpyInstance;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateParentComponent],
      imports: [
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParentComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    matDialog = TestBed.inject(MatDialog);
    component.userCreateFormGroup = fb.group({
      gender: new FormControl(''),
      dateOfBirth: new FormControl(''),
      phoneNumber: new FormControl('')
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group on init', () => {
    component.ngOnInit();
    expect(component.userCreateFormGroup).toBeTruthy();
    expect(component.userCreateFormGroup.controls.dateOfBirth).toBeTruthy();
    expect(component.userCreateFormGroup.controls.gender).toBeTruthy();
    expect(component.userCreateFormGroup.controls.phoneNumber).toBeTruthy();
  });

  it('should dispatch CreateParent action on form submit', () => {
    jest.spyOn(store, 'dispatch');
    component.userCreateFormGroup.setValue({
      dateOfBirth: '2021-01-01',
      gender: 'male',
      phoneNumber: '1234567890'
    });

    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(CreateParent));
  });

  it('should open confirmation dialog on cancel if not registered', () => {
    expectingMatDialogData = {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.leaveRegistration,
        property: ''
      }
    };
    matDialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationModalWindowComponent>);
    component.onCancel();
    expect(matDialogSpy).toHaveBeenCalledTimes(1);
    expect(matDialogSpy).toHaveBeenCalledWith(ConfirmationModalWindowComponent, expectingMatDialogData);
  });
});
