import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { Workshop } from 'shared/models/workshop.model';
import { GetInstitutionHierarchyParentsById } from 'shared/store/meta-data.actions';
import { of } from 'rxjs';
import { DeleteWorkshopDraftCoverImage, DeleteWorkshopDraftImage } from 'shared/store/shared-user.actions';
import { WorkshopInfoComponent } from './workshop-info.component';

describe('WorkshopInfoComponent', () => {
  let component: WorkshopInfoComponent;
  let fixture: ComponentFixture<WorkshopInfoComponent>;
  let store: Store;

  beforeEach(() => {
    const storeMock = {
      dispatch: jest.fn().mockImplementation(() => of(true)),
      select: jest.fn().mockImplementation(() => of())
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [WorkshopInfoComponent],
      providers: [{ provide: Store, useValue: storeMock }, provideRouter([])]
    });
    fixture = TestBed.createComponent(WorkshopInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetInstitutionHierarchyParentsById when workshop input changes', () => {
    const institutionHierarchyId = '123';
    const workshop = { institutionHierarchyId: institutionHierarchyId } as Workshop;
    component.setWorkshop = workshop;

    expect(store.dispatch).toHaveBeenCalledWith(new GetInstitutionHierarchyParentsById(institutionHierarchyId));
  });

  it('should emit closeInfo event on onCloseInfo call', () => {
    jest.spyOn(component.closeInfo, 'emit');
    component.onCloseInfo();
    expect(component.closeInfo.emit).toHaveBeenCalled();
  });

  it('should dispatch DeleteWorkshopDraftImage and update form values', () => {
    (component as any).workshopDraftId = 'workshop123';
    component.form.get('imageFiles').patchValue(['file1', 'file2']);
    component.form.get('imageIds').patchValue(['id1', 'id2']);

    component.onDeleteImage('id1');

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteWorkshopDraftImage('workshop123', 'id1'));
    const formValue = component.form.value;
    expect(formValue.imageIds).toEqual(['id2']);
    expect(formValue.imageFiles).toEqual(['file2']);
  });

  it('should dispatch DeleteWorkshopDraftCoverImage and update form values', () => {
    (component as any).workshopDraftId = 'workshop123';
    component.form.get('coverImage').patchValue(['coverFile']);
    component.form.get('coverImageId').patchValue(['id1']);

    component.onDeleteCoverImage();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteWorkshopDraftCoverImage('workshop123'));
    const formValue = component.form.value;
    expect(formValue.coverImageId).toEqual([]);
    expect(formValue.coverImage).toEqual([]);
  });

  it('should not update form if id not found', () => {
    component.form.get('imageFiles').patchValue(['File1', 'File2']);
    component.form.get('imageIds').patchValue(['id1', 'id2']);

    component.onDeleteImage('idX');

    const formValue = component.form.value;
    expect(formValue.imageIds).toEqual(['id1', 'id2']);
    expect(formValue.imageFiles).toEqual(['File1', 'File2']);
  });

  it('should apply workshop to form when form exists and coverImageId is present', () => {
    const workshop: Workshop = {
      id: 'id',
      coverImageId: 'coverImageId',
      imageIds: ['imageId1', 'imageId2']
    } as any;

    component.setWorkshop = workshop;

    expect(component.form.get('coverImageId').value).toEqual(['coverImageId']);
    expect(component.form.get('imageIds').value).toEqual(['imageId1', 'imageId2']);
  });

  it('should apply workshop to form with empty coverImageId when none is provided', () => {
    const workshop: Workshop = {
      id: 'id',
      imageIds: ['imageId1', 'imageId2']
    } as any;

    component.setWorkshop = workshop;

    expect(component.form.get('coverImageId').value).toEqual([]);
    expect(component.form.get('imageIds').value).toEqual(['imageId1', 'imageId2']);
  });

  it('should save pendingCompetition if form is not initialized', () => {
    const workshop: Workshop = {
      id: 'id',
      coverImageId: 'coverImageId',
      imageIds: ['imageId1', 'imageId2']
    } as any;

    component.form = null;
    component.setWorkshop = workshop;

    expect((component as any).pendingWorkshop).toBe(workshop);
  });
});
