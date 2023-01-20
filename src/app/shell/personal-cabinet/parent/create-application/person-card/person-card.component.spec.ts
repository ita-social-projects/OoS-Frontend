import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonCardComponent } from './person-card.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { PhoneTransformPipe } from '../../../../../shared/pipes/phone-transform.pipe';
import { JoinPipe } from '../../../../../shared/pipes/join.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('PersonCardComponent', () => {
  let component: PersonCardComponent;
  let fixture: ComponentFixture<PersonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [PersonCardComponent, PhoneTransformPipe, JoinPipe]
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
