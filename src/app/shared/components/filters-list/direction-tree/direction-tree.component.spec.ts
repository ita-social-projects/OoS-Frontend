// src/app/shared/components/filters-list/direction-tree/direction-tree.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Actions, NgxsModule, Store } from '@ngxs/store';

import { Direction, Subdirection, DirectionNode, DirectionsSelected } from 'shared/models/category.model';
import { DirectionsService } from 'shared/services/directions/directions.service';
import { SetDirections, SetIndeterminates, SetSubdirections } from 'shared/store/filter.actions';
import { DirectionTreeComponent } from './direction-tree.component';

describe('DirectionTreeComponent', () => {
  let component: DirectionTreeComponent;
  let fixture: ComponentFixture<DirectionTreeComponent>;

  let storeMock: { dispatch: jest.Mock };
  let directionsServiceMock: { getSubdirections: jest.Mock };
  let actionsSubject: Subject<any>;
  let actionsStub: { pipe: jest.Mock };

  const makeDirection = (id: number, title: string, subs: Subdirection[] = []): Direction => ({
    id,
    title,
    description: `${title}-desc`,
    subdirections: subs
  });

  const makeNode = (id: number, title = `dir-${id}`, children: DirectionNode[] = []): DirectionNode => ({
    id,
    title,
    description: `${title}-desc`,
    children
  });

  beforeEach(async () => {
    storeMock = { dispatch: jest.fn(() => of(null)) };
    directionsServiceMock = { getSubdirections: jest.fn(() => of({ entities: [] })) };
    actionsSubject = new Subject<any>();
    actionsStub = { pipe: jest.fn(() => actionsSubject.asObservable()) };

    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [DirectionTreeComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: DirectionsService, useValue: directionsServiceMock },
        { provide: Actions, useValue: actionsStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionTreeComponent);
    component = fixture.componentInstance;
    component.initialDirectionIds = {
      selectedDirectionIds: [],
      selectedSubdirectionIds: [],
      indeterminateDirectionIds: []
    } as DirectionsSelected;

    jest.spyOn(component as any, 'directions$', 'get').mockReturnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should transform incoming directions and set dataSource, then select initial ids', () => {
    const mockDirections: Direction = makeDirection(1, 'A', [{ id: 10, title: 'A1', description: 'A1' } as Subdirection]);
    const selectSpy = jest.spyOn(component as any, 'selectInitialIds');
    jest.spyOn(component as any, 'directions$', 'get').mockReturnValue(of([mockDirections]));

    component.ngOnInit();

    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].id).toBe(1);
    expect(selectSpy).toHaveBeenCalledWith(component.initialDirectionIds);
  });

  it('transformDirections should map directions to nodes', () => {
    const dirs: Direction[] = [makeDirection(1, 'A', [{ id: 11, title: 'A1', description: 'A1' } as Subdirection]), makeDirection(2, 'B')];
    const nodes = component.transformDirections(dirs);
    expect(nodes.length).toBe(2);
    expect(nodes[0].children.length).toBe(1);
    expect(nodes[1].children.length).toBe(0);
  });

  it('hasChild should return true when node has children', () => {
    expect(component.hasChild(0, makeNode(1, 'X', [makeNode(2)]))).toBe(true);

    const leaf = makeNode(1, 'X', []);
    (leaf as any).children = undefined;
    expect(component.hasChild(0, leaf)).toBe(false);
  });

  it('onToggle should load children when node has no children', () => {
    const node = makeNode(1, 'X', []);
    const loadSpy = jest.spyOn(component as any, 'loadChildren').mockImplementation(() => {});
    component.onToggle(node);
    expect(loadSpy).toHaveBeenCalledWith(node);
  });

  it('onToggle should refresh dataSource when node has children', () => {
    const node = makeNode(1, 'X', [makeNode(11, 'X1')]);
    (component as any).allDirections = [node];
    component.dataSource.data = [node];

    component.onToggle(node);

    expect(component.dataSource.data).toBe((component as any).allDirections);
  });

  it('onDirectionCheck should push id, dispatch and load children when checked', () => {
    const node = makeNode(1);
    const spyLoadAndPush = jest.spyOn(component as any, 'loadChildrenAndPush').mockImplementation(() => {});
    const event = { checked: true } as MatCheckboxChange;

    (component as any).selectedDirectionIds = [];
    component.onDirectionCheck(node, event);

    expect((component as any).selectedDirectionIds).toContain(1);
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetDirections));
    expect(spyLoadAndPush).toHaveBeenCalledWith(node);
  });

  it('onDirectionCheck should remove direction and children when unchecked', () => {
    const node = makeNode(2, 'D');
    const spyRemove = jest.spyOn(component as any, 'removeDirectionAndChildren').mockImplementation(() => {});
    const event = { checked: false } as MatCheckboxChange;

    component.onDirectionCheck(node, event);

    expect(spyRemove).toHaveBeenCalledWith(node);
  });

  it('onSubdirectionCheck should add/remove and dispatch subdirection ids', () => {
    const sub = makeNode(21);
    (component as any).selectedSubdirectionIds = [];

    component.onSubdirectionCheck(sub, { checked: true } as MatCheckboxChange);
    expect((component as any).selectedSubdirectionIds).toContain(21);
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetSubdirections));

    component.onSubdirectionCheck(sub, { checked: false } as MatCheckboxChange);
    expect((component as any).selectedSubdirectionIds).not.toContain(21);
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetSubdirections));
  });

  it('directionChecked should return true and set direction when all children selected; remove when not all', () => {
    const node = makeNode(3, 'C', [makeNode(31), makeNode(32)]);
    (component as any).selectedDirectionIds = [];
    (component as any).selectedSubdirectionIds = [31, 32];

    let result = component.directionChecked(node);
    expect(result).toBe(true);
    expect((component as any).selectedDirectionIds).toContain(3);
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetDirections));

    (component as any).selectedSubdirectionIds = [31];
    (component as any).selectedDirectionIds = [3];
    result = component.directionChecked(node);
    expect(result).toBe(false);
    expect((component as any).selectedDirectionIds).not.toContain(3);
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetDirections));
  });

  it('directionChecked should return true if in initDirectionIds', () => {
    const node = makeNode(4, 'D', []);
    component.initDirectionIds = [4];
    expect(component.directionChecked(node)).toBe(true);
  });

  it('subdirectionChecked should reflect internal selectedSubdirectionIds', () => {
    const sub = makeNode(51);
    (component as any).selectedSubdirectionIds = [51];
    expect(component.subdirectionChecked(sub)).toBe(true);
    (component as any).selectedSubdirectionIds = [];
    expect(component.subdirectionChecked(sub)).toBe(false);
  });

  it('isDirectionIndeterminate should be false for nodes without children and avoid dispatch if no change', () => {
    const node = makeNode(6, 'NoKids', []);
    storeMock.dispatch.mockClear();
    const result = component.isDirectionIndeterminate(node);
    expect(result).toBe(false);
    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });

  it('isDirectionIndeterminate should be true when some children selected and update store', () => {
    const node = makeNode(7, 'Partial', [makeNode(71), makeNode(72)]);
    (component as any).selectedSubdirectionIds = [71];
    (component as any).indeterminateDirectionIds = [];

    const res = component.isDirectionIndeterminate(node);

    expect(res).toBe(true);
    expect((component as any).indeterminateDirectionIds).toContain(7);
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetIndeterminates));
  });

  it('isDirectionIndeterminate should be false and remove id when all children selected', () => {
    const node = makeNode(8, 'All', [makeNode(81), makeNode(82)]);
    (component as any).selectedSubdirectionIds = [81, 82];
    (component as any).indeterminateDirectionIds = [8];

    const res = component.isDirectionIndeterminate(node);

    expect(res).toBe(false);
    expect((component as any).indeterminateDirectionIds).not.toContain(8);
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetIndeterminates));
  });

  it('loadChildren should fetch subs, update node children, refresh data and clear initial ids', () => {
    const node = makeNode(9, 'Load', []);
    (component as any).allDirections = [node];
    component.dataSource.data = [node];
    component.initDirectionIds = [9];
    component.initIndeterminateIds = [9];
    directionsServiceMock.getSubdirections.mockReturnValueOnce(of({ entities: [{ id: 91, title: 's', description: 's' }] }));

    (component as any).loadChildren(node);

    expect(node.children.length).toBe(1);
    expect(component.dataSource.data).toBe((component as any).allDirections);
    expect(component.initDirectionIds).not.toContain(9);
    expect(component.initIndeterminateIds).not.toContain(9);
  });

  it('loadChildrenAndPush should add children ids and dispatch, fetching if needed', () => {
    const node = makeNode(10, 'Fetch', []);
    directionsServiceMock.getSubdirections.mockReturnValueOnce(
      of({
        entities: [
          { id: 101, title: 'a', description: 'a' },
          { id: 102, title: 'b', description: 'b' }
        ]
      })
    );

    (component as any).selectedSubdirectionIds = [];
    (component as any).loadChildrenAndPush(node);

    expect((component as any).selectedSubdirectionIds).toEqual(expect.arrayContaining([101, 102]));
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetSubdirections));

    const node2 = makeNode(11, 'Have', [makeNode(111), makeNode(112)]);
    (component as any).selectedSubdirectionIds = [];
    (component as any).loadChildrenAndPush(node2);

    expect((component as any).selectedSubdirectionIds).toEqual(expect.arrayContaining([111, 112]));
    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.any(SetSubdirections));
  });

  it('removeDirectionAndChildren should remove direction id and all its sub ids, dispatching changes', () => {
    const node = makeNode(12, 'Remove', [makeNode(121), makeNode(122)]);
    (component as any).selectedDirectionIds = [12, 99];
    (component as any).selectedSubdirectionIds = [121, 122, 200];

    (component as any).removeDirectionAndChildren(node);

    expect((component as any).selectedDirectionIds).toEqual([99]);
    expect((component as any).selectedSubdirectionIds).toEqual([200]);
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('ngOnInit should clear selections when FilterClear action is emitted from actions$', () => {
    (component as any).selectedDirectionIds = [1];
    (component as any).selectedSubdirectionIds = [2];
    (component as any).indeterminateDirectionIds = [3];
    component.initDirectionIds = [4];
    component.initSubdirectionIds = [5];
    component.initIndeterminateIds = [6];

    component.ngOnInit();

    actionsSubject.next({});

    expect((component as any).selectedDirectionIds).toEqual([]);
    expect((component as any).selectedSubdirectionIds).toEqual([]);
    expect((component as any).indeterminateDirectionIds).toEqual([]);
    expect(component.initDirectionIds).toEqual([]);
    expect(component.initSubdirectionIds).toEqual([]);
    expect(component.initIndeterminateIds).toEqual([]);
  });
});
