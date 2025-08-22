import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'shared/shared.module';
import { provideRouter } from '@angular/router';
import { AdminCompetitionListComponent } from './admin-competition-list.component';

describe('AdminCompetitionListComponent', () => {
  let component: AdminCompetitionListComponent;
  let fixture: ComponentFixture<AdminCompetitionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), SharedModule, BrowserAnimationsModule],
      declarations: [AdminCompetitionListComponent],
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(AdminCompetitionListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
