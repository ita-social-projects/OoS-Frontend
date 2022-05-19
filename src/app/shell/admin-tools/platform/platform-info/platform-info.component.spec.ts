import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformInfoComponent } from './platform-info.component';

describe('PlatformInfoComponent', () => {
  let component: PlatformInfoComponent;
  let fixture: ComponentFixture<PlatformInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatformInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
