import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildInfoBoxComponent } from './child-info-box.component';
import { MatCardModule } from '@angular/material/card';
import { Child } from '../../models/child.model';
import { HttpClientModule } from '@angular/common/http';

describe('ChildInfoBoxComponent', () => {
  let component: ChildInfoBoxComponent;
  let fixture: ComponentFixture<ChildInfoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        HttpClientModule
      ],
      declarations: [ChildInfoBoxComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildInfoBoxComponent);
    component = fixture.componentInstance;
    component.child = {} as Child;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
