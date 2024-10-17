import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { Provider } from 'shared/models/provider.model';
import { CreateDescriptionFormComponent } from './create-description-form.component';

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
        NgxsModule.forRoot([]),
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatRadioModule,
        MatGridListModule,
        MatTooltipModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        CreateDescriptionFormComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MockInfoFormComponent,
        MockInstitutionHierarchyComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDescriptionFormComponent);
    component = fixture.componentInstance;
    component.DescriptionFormGroup = new FormGroup({
      imageFiles: new FormControl(''),
      description: new FormControl(''),
      disabilityOptionsDesc: new FormControl(''),
      head: new FormControl(''),
      keyWords: new FormControl(''),
      categories: new FormControl('')
    });

    component.DescriptionFormGroup.addControl('imageIds', new FormControl(['id1', 'id2', 'id3']));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeImageId', () => {
    it('should remove the image ID from the imageIds control', () => {
      const idToRemove = 'id2';

      component.removeImageId(idToRemove);

      expect(component.DescriptionFormGroup.controls.imageIds.value).toEqual(['id1', 'id3']);
    });

    it('should not modify imageIds control if the ID is not found', () => {
      const initialIds = component.DescriptionFormGroup.controls.imageIds.value.slice();
      const idToRemove = 'nonexistentId';

      component.removeImageId(idToRemove);

      expect(component.DescriptionFormGroup.controls.imageIds.value).toEqual(initialIds);
    });

    it('should handle empty imageIds control', () => {
      component.DescriptionFormGroup.controls.imageIds.setValue([]);

      const idToRemove = 'id2';

      component.removeImageId(idToRemove);

      expect(component.DescriptionFormGroup.controls.imageIds.value).toEqual([]);
    });
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintAboutComponent {
  @Input() validationFormControl: FormControl; // required for validation
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
}

@Component({
  selector: 'app-info-form',
  template: ''
})
class MockInfoFormComponent {
  @Input() InfoEditFormGroup: FormGroup;
  @Input() index: number;
  @Input() formAmount: number;
  @Input() maxDescriptionLength: number;
}

@Component({
  selector: '<app-institution-hierarchy',
  template: ''
})
class MockInstitutionHierarchyComponent {
  @Input() institutionHierarchyIdFormControl: FormControl;
  @Input() institutionIdFormControl: FormControl;
  @Input() provider: Provider;
}
