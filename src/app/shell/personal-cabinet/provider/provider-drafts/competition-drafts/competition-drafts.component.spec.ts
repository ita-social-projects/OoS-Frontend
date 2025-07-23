import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionDraftsComponent } from './competition-drafts.component';

describe('CompetitionDraftsComponent', () => {
  let component: CompetitionDraftsComponent;
  let fixture: ComponentFixture<CompetitionDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionDraftsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompetitionDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
