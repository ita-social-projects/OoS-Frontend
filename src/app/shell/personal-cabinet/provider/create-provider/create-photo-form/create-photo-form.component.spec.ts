import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePhotoFormComponent } from './create-photo-form.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { ImageFormControlComponent } from '../../../../../shared/components/image-form-control/image-form-control.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from "@angular/material/grid-list";

describe('CreatePhotoFormComponent', () => {
  let component: CreatePhotoFormComponent;
  let fixture: ComponentFixture<CreatePhotoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        MatIconModule,
        MatGridListModule
      ],
      declarations:
        [CreatePhotoFormComponent,
          ImageFormControlComponent
        ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePhotoFormComponent);
    component = fixture.componentInstance;
    component.PhotoFormGroup = new FormGroup({
      image: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    })
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
