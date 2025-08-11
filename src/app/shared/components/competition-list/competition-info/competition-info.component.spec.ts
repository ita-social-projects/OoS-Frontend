import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'shared/shared.module';
import { CompetitionInfoComponent } from './competition-info.component';

describe('CompetitionInfoComponent', () => {
  let component: CompetitionInfoComponent;
  let fixture: ComponentFixture<CompetitionInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), SharedModule]
    });
    fixture = TestBed.createComponent(CompetitionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeInfo event on onCloseInfo call', () => {
    jest.spyOn(component.closeInfo, 'emit');
    component.onCloseInfo();
    expect(component.closeInfo.emit).toHaveBeenCalled();
  });
});
