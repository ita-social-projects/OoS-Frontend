import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NoResultCardComponent } from './no-result-card.component';

describe('NoResultCardComponent', () => {
  let component: NoResultCardComponent;
  let fixture: ComponentFixture<NoResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoResultCardComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
