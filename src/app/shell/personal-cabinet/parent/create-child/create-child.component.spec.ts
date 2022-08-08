import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateChildComponent } from './create-child.component';
import { NgxsModule } from '@ngxs/store';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { ChildCards } from 'src/app/shared/models/child.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateChildComponent', () => {
  let component: CreateChildComponent;
  let fixture: ComponentFixture<CreateChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule
      ],
      declarations: [
        CreateChildComponent,
        MockChildFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-child-form',
  template: ''
})
class MockChildFormComponent {
  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: SocialGroup[];
  @Input() childrenCards: ChildCards[];
}
