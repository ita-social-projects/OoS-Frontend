import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentConfigComponent } from './parent-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { Component, Input } from '@angular/core';

describe('ParentConfigComponent', () => {
  let component: ParentConfigComponent;
  let fixture: ComponentFixture<ParentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        ParentConfigComponent,
        MockPersonCardComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-person-card',
  template: ''
})
class MockPersonCardComponent {
  @Input() card;
  @Input() isChildInfo: boolean;
}
