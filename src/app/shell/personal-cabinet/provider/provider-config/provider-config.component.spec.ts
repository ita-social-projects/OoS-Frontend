import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderConfigComponent } from './provider-config.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../../shared/mocks/mock-services';
import { MatIconModule } from '@angular/material/icon';

describe('ProviderConfigComponent', () => {
  let component: ProviderConfigComponent;
  let fixture: ComponentFixture<ProviderConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgxsModule.forRoot([]),
      ],
      providers: [
        { provide: Store, useValue: MockStore },
      ],
      declarations: [ ProviderConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderConfigComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
