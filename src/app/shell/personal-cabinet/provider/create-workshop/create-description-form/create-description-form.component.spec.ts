import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDescriptionFormComponent } from './create-description-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ImageFormControlComponent } from '../../../../../shared/components/image-form-control/image-form-control.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Workshop } from 'src/app/shared/models/workshop.model';

describe('CreateDescriptionFormComponent', () => {
  let component: CreateDescriptionFormComponent;
  let fixture: ComponentFixture<CreateDescriptionFormComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatChipsModule,
        MatAutocompleteModule,
        NgxsModule.forRoot([]),
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule
      ],
      declarations: [
        CreateDescriptionFormComponent,
        MockCategorySelectComponent,
        ImageFormControlComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-category-select',
  template: ''
})
class MockCategorySelectComponent {
  @Input() workshop: Workshop;
}
