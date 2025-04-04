import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleChange } from '@angular/core';
import { GetDirectionById } from 'shared/store/admin.actions';
import { of } from 'rxjs';
import { WorkshopInfoComponent } from './workshop-info.component';

describe('WorkshopInfoComponent', () => {
  let component: WorkshopInfoComponent;
  let fixture: ComponentFixture<WorkshopInfoComponent>;
  let store: Store;

  beforeEach(() => {
    const storeMock = {
      dispatch: jest.fn(),
      select: jest.fn().mockImplementation(() => of())
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), RouterTestingModule, TranslateModule.forRoot()],
      declarations: [WorkshopInfoComponent],
      providers: [{ provide: Store, useValue: storeMock }]
    });
    fixture = TestBed.createComponent(WorkshopInfoComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetDirectionById when workshop input changes with a new directionId', () => {
    const directionId = 123;
    const workshop = { directionIds: [directionId] };
    component.ngOnChanges({
      workshop: new SimpleChange(null, workshop, true)
    });

    expect(store.dispatch).toHaveBeenCalledWith(new GetDirectionById(directionId));
  });

  it('should emit closeInfo event on onCloseInfo call', () => {
    jest.spyOn(component.closeInfo, 'emit');
    component.onCloseInfo();
    expect(component.closeInfo.emit).toHaveBeenCalled();
  });

  it('should return true from hasSocialNetworks when workshop has contacts with social networks', () => {
    component.workshop = {
      contacts: [{ socialNetworks: ['socialNetwork'] }, { socialNetworks: [] }]
    } as any;
    expect(component.hasSocialNetworks()).toBe(true);
  });

  it('should return false from hasSocialNetworks when workshop has no contacts with social networks', () => {
    component.workshop = {
      contacts: [{ socialNetworks: [] }, { socialNetworks: undefined }]
    } as any;
    expect(component.hasSocialNetworks()).toBe(false);
  });
});
