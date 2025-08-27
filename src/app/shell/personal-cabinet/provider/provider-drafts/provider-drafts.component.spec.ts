import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { ProviderDraftsComponent } from './provider-drafts.component';

describe('ProviderDraftsComponent', () => {
  let component: ProviderDraftsComponent;
  let fixture: ComponentFixture<ProviderDraftsComponent>;
  const activatedRouteMock = {
    queryParams: of({})
  } as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ProviderDraftsComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderDraftsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tab params', () => {
    let router: Router;

    beforeEach(() => {
      jest.clearAllMocks();
      router = TestBed.inject(Router);
      jest.spyOn(router, 'navigate');
    });

    it('should set initial params if undefined', () => {
      const t = { tab: 'workshops' };
      activatedRouteMock.queryParams = of({ tab: undefined });
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
    });

    it('should set initial params', () => {
      const t = { tab: 'workshops' };
      activatedRouteMock.queryParams = of(t);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
    });

    it('should set initial params if they are incorrect', () => {
      const t = { tab: 'workshops' };
      activatedRouteMock.queryParams = of({ tab: 'wrong param' });
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
    });

    it('should set initial params if key is incorrect', () => {
      const t = { tab: 'workshops' };
      activatedRouteMock.queryParams = of({ w: 'wrong param' });
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
    });

    it('should set params on direct change', () => {
      let t = { tab: 'workshops' };
      const queryParams$ = new BehaviorSubject(t);
      activatedRouteMock.queryParams = queryParams$.asObservable();
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
      t = { tab: 'competitions' };
      queryParams$.next(t);
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
      expect(router.navigate).toHaveBeenCalledTimes(2);
    });

    it('should set params correctly if params are incorrect', () => {
      const t = { tab: 'workshops' };
      const queryParams$ = new BehaviorSubject(t);
      activatedRouteMock.queryParams = queryParams$.asObservable();
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
      queryParams$.next({ tab: 'wrong param' });
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
      expect(router.navigate).toHaveBeenCalledTimes(2);
    });

    it('should set params on tab change', () => {
      const t = { tab: 'competitions' };
      component.ngOnInit();
      component.onTabChange({ index: 1 } as MatTabChangeEvent);
      expect(router.navigate).toHaveBeenCalledWith([], { relativeTo: activatedRouteMock, queryParams: t });
    });
  });
});
