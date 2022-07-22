import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildInfoBoxComponent } from './child-info-box.component';
import { MatCardModule } from '@angular/material/card';
import { Child } from '../../../../../../shared/models/child.model';
import { HttpClientModule } from '@angular/common/http';
import { GeolocationService } from '../../../../../../shared/services/geolocation/geolocation.service';
import { ChildrenService } from '../../../../../../shared/services/children/children.service';
import { PhoneTransformPipe } from '../../../../../../shared/pipes/phone-transform.pipe';

describe('ChildInfoBoxComponent', () => {
  let component: ChildInfoBoxComponent;
  let fixture: ComponentFixture<ChildInfoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        HttpClientModule
      ],
      declarations: [ChildInfoBoxComponent, PhoneTransformPipe],
      providers: [
        { provide: ChildrenService, useValue: ChildrenService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildInfoBoxComponent);
    component = fixture.componentInstance;
    component.child = {
      parent: {}
    } as Child;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

