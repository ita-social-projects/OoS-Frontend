import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Child } from '../../../../../../shared/models/child.model';
import { ChildrenService } from '../../../../../../shared/services/children/children.service';
import { PhoneTransformPipe } from '../../../../../../shared/pipes/phone-transform.pipe';
import { JoinPipe } from '../../../../../../shared/pipes/join.pipe';
import { TranslateCasesPipe } from '../../../../../../shared/pipes/translate-cases.pipe';
import { ChildInfoBoxComponent } from './child-info-box.component';

describe('ChildInfoBoxComponent', () => {
  let component: ChildInfoBoxComponent;
  let fixture: ComponentFixture<ChildInfoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, HttpClientModule, TranslateModule.forRoot()],
      declarations: [ChildInfoBoxComponent, PhoneTransformPipe, JoinPipe, TranslateCasesPipe],
      providers: [{ provide: ChildrenService, useValue: ChildrenService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildInfoBoxComponent);
    component = fixture.componentInstance;
    component.child = {
      parent: {},
      socialGroups: []
    } as Child;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
