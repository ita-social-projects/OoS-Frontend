import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { NgxsModule } from '@ngxs/store';

import { StatusInfoComponent } from './status-info.component';

describe('StatusInfoComponent', () => {
  let component: StatusInfoComponent;
  let fixture: ComponentFixture<StatusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NgxsModule.forRoot([]),
       MatMenuModule, 
       MatDialogModule,
       MatDialogRef
      ],
      declarations: [StatusInfoComponent,  MatMenuTrigger],
      providers: [ MatDialogRef ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
