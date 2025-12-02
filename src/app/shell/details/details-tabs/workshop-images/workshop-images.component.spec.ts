import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopImagesComponent } from './workshop-images.component';

describe('WorkshopImagesComponent', () => {
  let component: WorkshopImagesComponent;
  let fixture: ComponentFixture<WorkshopImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkshopImagesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
