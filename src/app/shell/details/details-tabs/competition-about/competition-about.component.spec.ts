import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompetitionAboutComponent } from './competition-about.component';

describe('CompetitionAboutComponent', () => {
  let component: CompetitionAboutComponent;
  let fixture: ComponentFixture<CompetitionAboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(CompetitionAboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
