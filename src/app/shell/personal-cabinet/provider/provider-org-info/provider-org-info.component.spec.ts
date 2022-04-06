import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderOrgInfoComponent } from './provider-org-info.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { PhoneTransformPipe } from 'src/app/shared/pipes/phone-transform.pipe';

describe('ProviderOrgInfoComponent', () => {
  let component: ProviderOrgInfoComponent;
  let fixture: ComponentFixture<ProviderOrgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatIconModule,
        MatTabsModule,
        RouterTestingModule
      ],
      declarations: [
        ProviderOrgInfoComponent,
        PhoneTransformPipe,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderOrgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
