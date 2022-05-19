import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPlatformComponent } from './support-platform.component';

describe('SupportPlatformComponent', () => {
  let component: SupportPlatformComponent;
  let fixture: ComponentFixture<SupportPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportPlatformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
