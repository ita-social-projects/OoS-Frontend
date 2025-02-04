import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProviderEmployeesComponent } from './provider-employees.component';

describe('ProviderEmployeesComponent', () => {
  let component: ProviderEmployeesComponent;
  let fixture: ComponentFixture<ProviderEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderEmployeesComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
