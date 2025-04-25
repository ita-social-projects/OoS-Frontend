import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectionTreeComponent } from './direction-tree.component';

describe('DirectionTreeComponent', () => {
  let component: DirectionTreeComponent;
  let fixture: ComponentFixture<DirectionTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectionTreeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
