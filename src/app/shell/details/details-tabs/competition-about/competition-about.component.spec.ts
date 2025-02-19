import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CompetitionAboutComponent } from './competition-about.component';

describe('CompetitionAboutComponent', () => {
  let component: CompetitionAboutComponent;
  let fixture: ComponentFixture<CompetitionAboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitionAboutComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(CompetitionAboutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
