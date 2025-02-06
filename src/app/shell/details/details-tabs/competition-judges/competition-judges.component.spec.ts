import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Judge } from 'shared/models/judge.model';
import { CompetitionJudgesComponent } from './competition-judges.component';

describe('CompetitionJudgesComponent', () => {
  let component: CompetitionJudgesComponent;
  let fixture: ComponentFixture<CompetitionJudgesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitionJudgesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompetitionJudgesComponent);
    component = fixture.componentInstance;
  });
  it('it should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should have default value', () => {
    expect(component.noResultJudges).toBe(NoResultsTitle.noJudges);
  });

  it('it should expect correct input judge', () => {
    const mockJudge: Judge[] = [
      {
        firstName: 'Jack',
        lastName: 'Smith',
        dateOfBirth: '',
        gender: 'Male',
        isChiefJudge: false,
        coverImageId: ''
      }
    ];
    component.judges = mockJudge;
    expect(component.judges).toEqual(mockJudge);
  });
});
