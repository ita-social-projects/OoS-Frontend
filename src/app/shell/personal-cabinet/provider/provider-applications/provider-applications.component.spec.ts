import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderApplicationsComponent } from './provider-applications.component';

describe('ProviderApplicationsComponent', () => {
  let component: ProviderApplicationsComponent;
  let fixture: ComponentFixture<ProviderApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderApplicationsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
