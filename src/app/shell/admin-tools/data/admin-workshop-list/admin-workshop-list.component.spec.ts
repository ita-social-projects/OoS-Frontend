import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'shared/shared.module';
import { provideRouter } from '@angular/router';
import { AdminWorkshopListComponent } from './admin-workshop-list.component';

describe('AdminWorkshopInfoComponent', () => {
  let component: AdminWorkshopListComponent;
  let fixture: ComponentFixture<AdminWorkshopListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), SharedModule, BrowserAnimationsModule],
      declarations: [AdminWorkshopListComponent],
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(AdminWorkshopListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
