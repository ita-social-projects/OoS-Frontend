import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { JoinPipe } from 'shared/pipes/join.pipe';
import { PhonePipe } from 'shared/pipes/phone.pipe';
import { PersonCardComponent } from './person-card.component';

describe('PersonCardComponent', () => {
  let component: PersonCardComponent;
  let fixture: ComponentFixture<PersonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [PersonCardComponent, PhonePipe, JoinPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonCardComponent);
    component = fixture.componentInstance;
    component.child = {
      socialGroups: [
        {
          name: ''
        }
      ]
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
