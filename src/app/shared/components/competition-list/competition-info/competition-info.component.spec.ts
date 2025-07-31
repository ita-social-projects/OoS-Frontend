import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { Workshop } from 'shared/models/workshop.model';
import { GetDirectionById } from 'shared/store/admin.actions';
import { of } from 'rxjs';
import { WorkshopInfoComponent } from './competition-info.component';

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

  it('should dispatch GetDirectionById when workshop input changes with a new directionId', () => {
    const directionId = 123;
    const workshop = { directionIds: [directionId] } as Workshop;
    component.setWorkshop = workshop;

    expect(store.dispatch).toHaveBeenCalledWith(new GetDirectionById(directionId));
  });

  it('should emit closeInfo event on onCloseInfo call', () => {
    jest.spyOn(component.closeInfo, 'emit');
    component.onCloseInfo();
    expect(component.closeInfo.emit).toHaveBeenCalled();
  });
});
