import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProviderEmployeesComponent } from './provider-employees.component';

describe('YourComponent', () => {
  let component: ProviderEmployeesComponent;
  let fixture: ComponentFixture<ProviderEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderEmployeesComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ініціалізація змін
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
