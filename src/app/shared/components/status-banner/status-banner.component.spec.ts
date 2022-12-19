import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { Statuses } from '../../enum/statuses';

import { StatusBannerComponent } from './status-banner.component';

describe('FullWidthBannerComponent', () => {
  let component: StatusBannerComponent;
  let fixture: ComponentFixture<StatusBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [StatusBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBannerComponent);
    component = fixture.componentInstance;
    component.providerStatus = { status: Statuses.Accepted, statusReason: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
