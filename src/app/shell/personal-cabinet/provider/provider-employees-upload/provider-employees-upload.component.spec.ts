import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProviderEmployeesUploadComponent } from './provider-employees-upload.component';

describe('ProviderEmployeesUploadComponent', () => {
  let component: ProviderEmployeesUploadComponent;
  let fixture: ComponentFixture<ProviderEmployeesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderEmployeesUploadComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderEmployeesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
