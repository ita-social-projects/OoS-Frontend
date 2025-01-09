import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { GetUnfinishedWorkshop } from 'shared/store/provider.actions';
import { FormOfLearning, PayRateType } from 'shared/enum/workshop';
import { WorkshopMainRequiredProperties } from 'shared/models/draftWorkshop.model';
import { of } from 'rxjs';
import { CreateWorkshopComponent } from './create-workshop.component';

describe('CreateWorkshopComponent', () => {
  let component: CreateWorkshopComponent;
  let fixture: ComponentFixture<CreateWorkshopComponent>;
  let routeMock: any;
  let storeMock: any;

  const mockWorkshop: WorkshopMainRequiredProperties = {
    availableSeats: 4294967295,
    competitiveSelection: false,
    competitiveSelectionDescription: null,
    dateTimeRanges: [{ workdays: ['friday'], startTime: '12:22', endTime: '13:33' }],
    email: 'sleep@gmail.com',
    facebook: null,
    formOfLearning: FormOfLearning.Offline,
    instagram: null,
    maxAge: 5,
    minAge: 2,
    payRate: PayRateType.Classes,
    phone: '+380686042323',
    price: 20,
    providerId: '08da842d-12fc-4865-85c5-ec6e6142abad',
    shortTitle: 'fghjhgf',
    title: 'fkfkkff',
    website: 'https://stackoverflow.com/questions/47933634/angular-2-material-select-open-with-button'
  };

  beforeEach(async () => {
    routeMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('unfinished')
        }
      }
    };

    storeMock = {
      selectSnapshot: jest.fn().mockReturnValue({ id: mockWorkshop.providerId }),
      dispatch: jest.fn().mockResolvedValue(undefined),
      select: jest.fn((selector) => {
        if (typeof selector === 'function') {
          return of({ provider: { workshopDraft: mockWorkshop } });
        }
        return of(null);
      })
    };

    await TestBed.configureTestingModule({
      imports: [MatStepperModule, RouterTestingModule, BrowserAnimationsModule, NgxsModule.forRoot([]), HttpClientTestingModule],
      declarations: [CreateWorkshopComponent],
      providers: [{ provide: Store, useValue: storeMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkshopComponent);
    component = fixture.componentInstance;
    component.AboutFormGroup = new FormGroup({
      availableSeats: new FormControl(mockWorkshop.availableSeats),
      competitiveSelection: new FormControl(mockWorkshop.competitiveSelection),
      competitiveSelectionDescription: new FormControl(mockWorkshop.competitiveSelectionDescription),
      dateTimeRanges: new FormControl(mockWorkshop.dateTimeRanges),
      email: new FormControl(mockWorkshop.email),
      facebook: new FormControl(mockWorkshop.facebook),
      formOfLearning: new FormControl(mockWorkshop.formOfLearning),
      instagram: new FormControl(mockWorkshop.instagram),
      maxAge: new FormControl(mockWorkshop.maxAge),
      minAge: new FormControl(mockWorkshop.minAge),
      payRate: new FormControl(mockWorkshop.payRate),
      phone: new FormControl(mockWorkshop.phone),
      price: new FormControl(mockWorkshop.price),
      shortTitle: new FormControl(mockWorkshop.shortTitle),
      title: new FormControl(mockWorkshop.title),
      website: new FormControl(mockWorkshop.website)
    });
    component.provider = { id: mockWorkshop.providerId } as any;
    component.AddressFormGroup = new FormGroup({});
    component.DescriptionFormGroup = new FormGroup({});
    component.TeacherFormArray = new FormArray([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false if route param is unfinished', () => {
    jest.spyOn(component as any, 'getRouteParam').mockReturnValue('unfinished');
    expect(component.isDirtyAndNotUnfinished()).toBe(false);
  });

  it('should return false if form is dirty', () => {
    component.AboutFormGroup.markAsDirty();
    expect(component.isDirtyAndNotUnfinished()).toBe(false);
  });

  it('should return first invalid step index', () => {
    component.AboutFormGroup.get('title')?.setErrors({ required: true });
    expect((component as any).getFirstInvalidStep()).toBe(0);
  });

  it('should dispatch GetDraftWorkshop and set workshop data', (done) => {
    component.loadUnfinishedWorkshopData();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new GetUnfinishedWorkshop());
    (component as any).unfinishedWorkshop$.subscribe((draft) => {
      expect(draft).toEqual({ provider: { workshopDraft: mockWorkshop } });
      done();
    });
  });
});
