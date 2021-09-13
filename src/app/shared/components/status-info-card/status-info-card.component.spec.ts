import { MatMenuModule, MatMenuTrigger, _MatMenuDirectivesModule } from '@angular/material/menu';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusInfoCardComponent } from './status-info-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';

describe('StatusInfoCardComponent', () => {
  let component: StatusInfoCardComponent;
  let fixture: ComponentFixture<StatusInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[  
      NgxsModule.forRoot([]),
      MatMenuModule, 
      MatDialogModule,
      _MatMenuDirectivesModule],
      declarations: [ StatusInfoCardComponent ],

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
