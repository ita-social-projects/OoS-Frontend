import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetPositionById, CreatePosition, UpdatePosition } from 'shared/store/provider.actions';
import { CreatePositionComponent } from './create-position.component';
import { CreatePositionFormComponent } from './position-form/create-position-form.component';

describe('CreatePositionComponent', () => {
  let component: CreatePositionComponent;
  let fixture: ComponentFixture<CreatePositionComponent>;
  let mockStore: jest.Mocked<Store>;
  let mockNavigationBarService: jest.Mocked<NavigationBarService>;
  let mockRouter: jest.Mocked<Router>;
  let mockRoute: ActivatedRoute;

  beforeEach(async () => {
    mockStore = {
      dispatch: jest.fn(),
      select: jest.fn(),
      selectSnapshot: jest.fn()
    } as any;

    mockNavigationBarService = {
      createNavPaths: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123')
        }
      }
    } as any;

    await TestBed.configureTestingModule({
      declarations: [CreatePositionComponent, CreatePositionFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, NgxsModule.forRoot()],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: NavigationBarService, useValue: mockNavigationBarService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        ChangeDetectorRef
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePositionComponent);
    component = fixture.componentInstance;

    mockStore.select.mockReturnValue(of(null));
    mockStore.selectSnapshot.mockReturnValue(null);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to provider$', () => {
      mockStore.select.mockReturnValue(of({ id: '1', name: 'Test Provider' }));

      component.ngOnInit();

      expect(component.provider).toEqual({ id: '1', name: 'Test Provider' });
    });

    it('should call determineEditMode, determineRelease, and addNavPath', () => {
      const determineEditModeSpy = jest.spyOn(component as any, 'determineEditMode');
      const determineReleaseSpy = jest.spyOn(component as any, 'determineRelease');
      const addNavPathSpy = jest.spyOn(component, 'addNavPath');

      component.ngOnInit();

      expect(determineEditModeSpy).toHaveBeenCalled();
      expect(determineReleaseSpy).toHaveBeenCalled();
      expect(addNavPathSpy).toHaveBeenCalled();
    });
  });

  describe('setEditMode', () => {
    it('should dispatch GetPositionById with correct arguments', () => {
      mockStore.select.mockReturnValue(of({ id: '123', name: 'Test Provider' }));

      component.setEditMode();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetPositionById('123', '123'));
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.PositionFormGroup = new FormGroup({});
      component.provider = { id: '1', name: 'Test Provider' } as any;
    });

    it('should dispatch UpdatePosition in edit mode', () => {
      component.editMode = true;
      component.position = { id: '2' } as any;

      component.onSubmit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(UpdatePosition));
    });

    it('should dispatch CreatePosition in create mode', () => {
      component.editMode = false;

      component.onSubmit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(CreatePosition));
    });
  });

  describe('onCancel', () => {
    it('should navigate to the positions list page', () => {
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/personal-cabinet/provider/positions']);
    });
  });

  describe('addNavPath', () => {
    it('should dispatch AddNavPath with correct arguments', () => {
      const mockNavigationPaths = [
        { name: 'path1', path: '/path1', isActive: false, disable: false },
        { name: 'path2', path: '/path2', isActive: true, disable: false }
      ];
      mockNavigationBarService.createNavPaths.mockReturnValue(mockNavigationPaths);

      component.addNavPath();

      expect(mockStore.dispatch).toHaveBeenCalledWith(expect.any(Object));
      expect(mockNavigationBarService.createNavPaths).toHaveBeenCalled();
    });
  });
});
