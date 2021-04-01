import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderOrgInfoComponent } from './provider-org-info.component';

describe('ProviderOrgInfoComponent', () => {
  let component: ProviderOrgInfoComponent;
  let fixture: ComponentFixture<ProviderOrgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderOrgInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderOrgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
