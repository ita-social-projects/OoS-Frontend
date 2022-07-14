import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderApplciationsComponent } from './provider-applciations.component';

describe('ProviderApplciationsComponent', () => {
  let component: ProviderApplciationsComponent;
  let fixture: ComponentFixture<ProviderApplciationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderApplciationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderApplciationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
