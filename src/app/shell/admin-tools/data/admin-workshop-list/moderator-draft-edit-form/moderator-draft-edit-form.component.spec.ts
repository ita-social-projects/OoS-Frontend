import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store/';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EditWorkshopDraftByModerator } from 'shared/store/shared-user.actions';
import { ModeratorDraftEditFormComponent } from './moderator-draft-edit-form.component';

describe('ModerateWorkshopFormComponent', () => {
  let component: ModeratorDraftEditFormComponent;
  let fixture: ComponentFixture<ModeratorDraftEditFormComponent>;

  let activatedRouteMock: any;
  let storeMock: any;

  beforeEach(() => {
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'mock-id'
        }
      }
    };

    storeMock = {
      dispatch: jest.fn().mockReturnValue(of(null)),
      select: jest.fn().mockReturnValue(of(null))
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [ModeratorDraftEditFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        },
        {
          provide: Store,
          useValue: storeMock
        }
      ]
    });
    fixture = TestBed.createComponent(ModeratorDraftEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new form group to workshopDescriptionItems', () => {
    const initialLength = component.SectionItemsFormArray.length;

    component.onAddForm();

    expect(component.SectionItemsFormArray.length).toBe(initialLength + 1);
  });

  it('should remove a form group from workshopDescriptionItems', () => {
    component.onAddForm();
    const initialLength = component.SectionItemsFormArray.length;

    component.onDeleteForm(0);

    expect(component.SectionItemsFormArray.length).toBe(initialLength - 1);
  });

  it('should not dispatch EditWorkshopDraftByModerator if form is invalid', () => {
    const dispatchSpy = jest.spyOn(storeMock, 'dispatch');

    component.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalledWith(new EditWorkshopDraftByModerator(expect.anything(), expect.anything(), expect.anything()));
  });

  it('should dispatch EditWorkshopDraftByModerator with correct data when form is valid', () => {
    component.form.patchValue({
      title: 'Valid Title',
      shortTitle: 'Short Title',
      competitiveSelectionDescription: 'Description',
      enrollmentProcedureDescription: 'Procedure',
      preferentialTermsOfParticipation: 'Terms',
      institutionHierarchyId: '1',
      institutionId: '1'
    });
    component.onAddForm();
    component.SectionItemsFormArray.at(0).patchValue({
      sectionName: 'Section 1',
      description: 'Description 1'
    });
    component.currentUser = { id: 'user-id' } as any;
    component.selectedWorkshop = { workshopDraftId: 'draft-id' } as any;
    const dispatchSpy = jest.spyOn(storeMock, 'dispatch');

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(new EditWorkshopDraftByModerator(component.form.getRawValue(), 'user-id', 'draft-id'));
  });

  it('should remove imageId and imageFile from form controls on image deletion', () => {
    component.form.get('imageIds').setValue(['img1', 'img2']);
    component.form.get('imageFiles').setValue(['file1', 'file2']);
    component.selectedWorkshop = { workshopDraftId: 'draft-id' } as any;
    component.currentUser = { id: 'user-id' } as any;

    jest.spyOn(storeMock, 'dispatch').mockReturnValue({
      pipe: () => ({
        subscribe: (callback) => callback()
      })
    } as any);

    component.onDeleteImage('img1');

    expect(component.form.get('imageIds').value).toEqual(['img2']);
    expect(component.form.get('imageFiles').value).toEqual(['file2']);
  });

  it('should remove coverImage and coverImageId from form controls on cover image deletion', () => {
    component.form.get('coverImageId').setValue(['img1']);
    component.form.get('coverImage').setValue(['file1']);
    component.selectedWorkshop = { workshopDraftId: 'draft-id' } as any;
    component.currentUser = { id: 'user-id' } as any;
    jest.spyOn(storeMock, 'dispatch').mockReturnValue({
      pipe: () => ({
        subscribe: (callback) => callback()
      })
    } as any);

    component.onDeleteCoverImage();

    expect(component.form.get('coverImageId').value).toEqual([]);
    expect(component.form.get('coverImage').value).toEqual([]);
  });
});
