import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'shared/shared.module';
import { of } from 'rxjs';
import { DeleteCompetitionDraftCoverImage, DeleteCompetitionDraftImage } from 'shared/store/shared-user.actions';
import { Competition } from 'shared/models/competition.model';
import { CompetitionInfoComponent } from './competition-info.component';

describe('CompetitionInfoComponent', () => {
  let component: CompetitionInfoComponent;
  let fixture: ComponentFixture<CompetitionInfoComponent>;
  let store: Store;

  beforeEach(() => {
    const storeMock: Partial<jest.Mocked<Store>> = {
      dispatch: jest.fn().mockReturnValue(of({})),
      select: jest.fn().mockReturnValue(of({}))
    };
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), SharedModule],
      declarations: [CompetitionInfoComponent],
      providers: [{ provide: Store, useValue: storeMock }]
    });
    fixture = TestBed.createComponent(CompetitionInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch DeleteCompetitionDraftImage and update form values', () => {
    (component as any).competitionDraftId = 'competition';
    component.form.get('imageFiles').patchValue(['file1', 'file2']);
    component.form.get('imageIds').patchValue(['id1', 'id2']);

    component.onDeleteImage('id1');

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteCompetitionDraftImage('competition', 'id1'));
    const formValue = component.form.value;
    expect(formValue.imageIds).toEqual(['id2']);
    expect(formValue.imageFiles).toEqual(['file2']);
  });

  it('should dispatch DeleteCompetitionDraftCoverImage and update form values', () => {
    (component as any).competitionDraftId = 'competition';
    component.form.get('coverImage').patchValue(['coverFile']);
    component.form.get('coverImageId').patchValue(['id1']);

    component.onDeleteCoverImage();

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteCompetitionDraftCoverImage('competition'));
    const formValue = component.form.value;
    expect(formValue.coverImageId).toEqual([]);
    expect(formValue.coverImage).toEqual([]);
  });

  it('should emit closeInfo event on onCloseInfo call', () => {
    jest.spyOn(component.closeInfo, 'emit');
    component.onCloseInfo();
    expect(component.closeInfo.emit).toHaveBeenCalled();
  });

  it('should apply competition to form when form exists and coverImageId is present', () => {
    const competition: Competition = {
      id: 'id',
      coverImageId: 'cover123',
      imageIds: ['img1', 'img2']
    } as any;

    component.setCompetition = competition;

    expect(component.form.get('coverImageId').value).toEqual(['cover123']);
    expect(component.form.get('imageIds').value).toEqual(['img1', 'img2']);
  });

  it('should apply competition to form with empty coverImageId when none is provided', () => {
    const competition: Competition = {
      id: 'id',
      coverImageId: null,
      imageIds: ['img1']
    } as any;

    component.setCompetition = competition;

    expect(component.form.get('coverImageId').value).toEqual([]);
    expect(component.form.get('imageIds').value).toEqual(['img1']);
  });

  it('should save pendingCompetition if form is not initialized', () => {
    const competition: Competition = {
      id: 'id',
      coverImageId: 'coverImageId',
      imageIds: ['imageId1', 'imageId2']
    } as any;

    component.form = null;
    component.setCompetition = competition;

    expect((component as any).pendingCompetition).toBe(competition);
  });
});
