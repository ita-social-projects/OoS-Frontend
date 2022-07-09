import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageInfoComponent } from './main-page-info.component';

describe('MainPageInfoComponent', () => {
  let component: MainPageInfoComponent;
  let fixture: ComponentFixture<MainPageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPageInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
