import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { AdminWorkshopListComponent } from './admin-workshop-list.component';

describe('AdminWorkshopListComponent', () => {
  let component: AdminWorkshopListComponent;
  let fixture: ComponentFixture<AdminWorkshopListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot()],
      declarations: [AdminWorkshopListComponent]
    });
    fixture = TestBed.createComponent(AdminWorkshopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
