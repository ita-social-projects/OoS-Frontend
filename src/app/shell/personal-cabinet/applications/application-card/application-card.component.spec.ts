import { StatusInfoComponent } from './../../../../shared/components/status-info/status-info.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCardComponent } from './application-card.component';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StatusInfoCardComponent } from 'src/app/shared/components/status-info-card/status-info-card.component';
describe('ApplicationCardComponent', () => {
  let component: ApplicationCardComponent;
  let fixture: ComponentFixture<ApplicationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

        MatCardModule,
        RouterTestingModule,
        HttpClientModule,
        MatIconModule
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'uk' },
      ],
      declarations: [
        ApplicationCardComponent,
        StatusInfoComponent,
        StatusInfoCardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
