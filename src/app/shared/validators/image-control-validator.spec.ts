import { TestBed } from '@angular/core/testing';

import { FormControl, FormGroup } from '@angular/forms';
import { ImageControlValidator } from './image-control-validator';

describe('ImageControlValidator', () => {
  const validator = ImageControlValidator('coverImage', 'imageUrl');

  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      coverImage: new FormControl([]),
      imageUrl: new FormControl('')
    });

    // Attach validator to the group
    formGroup.setValidators(validator);
  });

  it('should be created', () => {
    expect(validator).toBeTruthy();
  });

  it('should return error when both fields are empty and coverImage is touched', () => {
    formGroup.get('coverImage')?.markAsTouched();
    formGroup.get('coverImage')?.setValue([]);
    formGroup.get('imageUrl')?.setValue('');

    expect(validator(formGroup)).toEqual({ imageControlError: true });
  });

  it('should be valid if coverImage is filled', () => {
    formGroup.get('coverImage')?.markAsTouched();
    formGroup.get('coverImage')?.setValue(['image.png']);
    formGroup.get('imageUrl')?.setValue('');

    expect(validator(formGroup)).toBeNull();
  });

  it('should be valid if imageUrl is filled', () => {
    formGroup.get('coverImage')?.markAsTouched();
    formGroup.get('coverImage')?.setValue([]);
    formGroup.get('imageUrl')?.setValue('http://example.com/image.jpg');

    expect(validator(formGroup)).toBeNull();
  });

  it('should be valid if both fields are filled', () => {
    formGroup.get('coverImage')?.markAsTouched();
    formGroup.get('coverImage')?.setValue(['image.png']);
    formGroup.get('imageUrl')?.setValue('http://example.com/image.jpg');

    expect(validator(formGroup)).toBeNull();
  });

  it('should be valid if both are empty but coverImage is not touched', () => {
    formGroup.get('coverImage')?.markAsUntouched();
    formGroup.get('coverImage')?.setValue([]);
    formGroup.get('imageUrl')?.setValue('');

    expect(validator(formGroup)).toBeNull();
  });
});
