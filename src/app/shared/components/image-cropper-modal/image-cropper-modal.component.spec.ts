import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';

import { ShowMessageBar } from 'shared/store/app.actions';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { Cropper } from '../../models/cropper';
import { ImageCropperModalComponent } from './image-cropper-modal.component';

describe('ImageCropperModalComponent', () => {
  let component: ImageCropperModalComponent;
  let fixture: ComponentFixture<ImageCropperModalComponent>;
  let mockDialogRef: MatDialogRef<ImageCropperModalComponent>;
  let store: Store;

  const testImage = new Event('test');
  const testCropperConfig = { cropperAspectRatio: 1, cropperMinWidth: 100, cropperMinHeight: 100 } as Cropper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, NgxsModule.forRoot(), TranslateModule.forRoot()],
      declarations: [ImageCropperModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { image: testImage, cropperConfig: testCropperConfig } },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: Store, useValue: { dispatch: jest.fn() } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperModalComponent);
    component = fixture.componentInstance;

    mockDialogRef = TestBed.inject(MatDialogRef);
    store = TestBed.inject(Store);

    component.data.cropperConfig = testCropperConfig;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided MAT_DIALOG_DATA', () => {
    expect(component.data.image).toBe(testImage);
    expect(component.data.cropperConfig).toEqual(testCropperConfig);
  });

  it('should call dialogRef.close with the imageFile when onConfirm is called', () => {
    const testImageFile = new File(['test'], 'test-image.png');
    component.imageFile = testImageFile;

    component.onConfirm();

    expect(mockDialogRef.close).toHaveBeenCalledWith(testImageFile);
  });

  it('should set croppedImage and imageFile when imageCropped is called', () => {
    const mockEvent: ImageCroppedEvent = {
      base64: null,
      blob: new Blob(['test image'], { type: 'image/png' }),
      objectUrl: 'http://test.com/test.png',
      width: 800,
      height: 600,
      cropperPosition: { x1: 0, y1: 0, x2: 0, y2: 0 },
      imagePosition: { x1: 0, y1: 0, x2: 0, y2: 0 }
    };

    component.imageCropped(mockEvent);

    expect(component.croppedImage).toBe(mockEvent.objectUrl);
    expect(component.imageFile).toEqual(mockEvent.blob);
  });

  it('should dispatch ShowMessageBar action with error message when loadImageFailed is called', () => {
    component.loadImageFailed();

    expect(store.dispatch).toHaveBeenCalledWith(new ShowMessageBar({ message: SnackbarText.errorToLoadImg, type: 'error' }));
  });
});
