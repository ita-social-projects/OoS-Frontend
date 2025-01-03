import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { ResultToTopBtnComponent } from './result-to-top-btn.component';

describe('ResultToTopBtnComponent', () => {
  let component: ResultToTopBtnComponent;
  let fixture: ComponentFixture<ResultToTopBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule, NgxsModule.forRoot([])],
      declarations: [ResultToTopBtnComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultToTopBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
