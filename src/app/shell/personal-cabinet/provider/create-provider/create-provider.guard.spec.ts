import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { CreateInfoFormComponent } from './create-info-form/create-info-form.component';
import { CreateProviderGuard } from './create-provider.guard';

describe('CreateProviderGuard', () => {
  let guard: CreateProviderGuard;
  let component: CreateInfoFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      declarations: [
        FormsModule
      ]
    });
    guard = TestBed.inject(CreateProviderGuard);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
