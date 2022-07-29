import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';

import { AdminsComponent } from './admins.component';

describe('AdminsComponent', () => {
  let component: AdminsComponent;
  let fixture: ComponentFixture<AdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [ 
        AdminsComponent,
        NoResultCardComponent
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
