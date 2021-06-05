import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderOrgInfoComponent } from './provider-org-info.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../../shared/mocks/mock-services';

describe('ProviderOrgInfoComponent', () => {
  let component: ProviderOrgInfoComponent;
  let fixture: ComponentFixture<ProviderOrgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      providers: [
        { provide: Store, useValue: MockStore },
      ],
      declarations: [ ProviderOrgInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderOrgInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
