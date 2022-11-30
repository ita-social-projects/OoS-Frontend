import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { DirectionsWrapperComponent } from './directions-wrapper.component';
import { DirectionsComponent } from './directions/directions.component';

describe('DirectionsWrapperComponent', () => {
  let component: DirectionsWrapperComponent;
  let fixture: ComponentFixture<DirectionsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatTabsModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [DirectionsWrapperComponent, DirectionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectionsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
