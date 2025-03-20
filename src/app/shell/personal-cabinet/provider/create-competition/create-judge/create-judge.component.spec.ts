import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateJudgeComponent } from './create-judge.component';

describe('CreateJudgeComponent', () => {
  let fixture: ComponentFixture<CreateJudgeComponent>;
  let component: CreateJudgeComponent;
  let mockMatDialog: MatDialogModule;

  beforeEach(() => {
    mockMatDialog = {
      open: jest.fn()
    };
    TestBed.configureTestingModule({
      declarations: [CreateJudgeComponent],
      providers: [{ provide: MatDialog, useValue: mockMatDialog }]
    });
    fixture = TestBed.createComponent(CreateJudgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
