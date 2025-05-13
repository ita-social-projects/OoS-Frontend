import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorDraftEditFormComponent } from './moderator-draft-edit-form.component';

describe('ModerateWorkshopFormComponent', () => {
  let component: ModeratorDraftEditFormComponent;
  let fixture: ComponentFixture<ModeratorDraftEditFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModeratorDraftEditFormComponent]
    });
    fixture = TestBed.createComponent(ModeratorDraftEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
