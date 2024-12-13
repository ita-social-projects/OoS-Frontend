import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxsModule, State, Store } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ShowMessageBar } from 'shared/store/app.actions';
import { AppStateModel } from 'shared/store/app.state';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { SharedModule } from 'shared/shared.module';
import { ImageFormControlComponent } from './image-form-control.component';

describe('ImageFormControlComponent', () => {
  let component: ImageFormControlComponent;
  let fixture: ComponentFixture<ImageFormControlComponent>;
  let dispatchSpy: jest.SpyInstance;
  let store: Store;
  let fileReaderMock: { onload: any; readAsDataURL?: jest.Mock<any, any, any> };
  let mockEvent: Event;
  let imgMock: { onload: any; src?: string; width?: number; height?: number };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatGridListModule,
        MatDialogModule,
        NgxsModule.forRoot([MockAppState]),
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [ImageFormControlComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ImageFormControlComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    dispatchSpy = jest.spyOn(store, 'dispatch');
    jest.spyOn(component, 'openCropperModal');

    fixture.detectChanges();

    component.cropperConfig = {
      cropperMinWidth: 100,
      cropperMinHeight: 100,
      cropperMaxWidth: 200,
      cropperMaxHeight: 200
    };

    component.inputImage = { nativeElement: { click: jest.fn() } } as any;

    fileReaderMock = { onload: jest.fn(), readAsDataURL: jest.fn() };
    mockEvent = {
      target: {
        files: [new File(['image'], 'test name', { type: 'image/jpeg' })]
      }
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and activateEditMode if imageIdsFormControl has values', () => {
    const activateEditModeSpy = jest.spyOn(component, 'activateEditMode');
    component.imageIdsFormControl = { value: ['image1', 'image2'] } as any;

    component.ngOnInit();

    expect(activateEditModeSpy).toHaveBeenCalled();
  });

  it('should remove the image and update the imageIdsFormControl', () => {
    const mockDecodedImage = { image: 'http://storage-url/image1.jpg', imgFile: new File([], 'image1.jpg') } as any;
    component.decodedImages = [mockDecodedImage];
    component.selectedImages = [mockDecodedImage.imgFile];

    component.imageIdsFormControl = {
      value: ['image1.jpg'],
      setValue: jest.fn()
    } as any;

    component.onRemoveImg(mockDecodedImage);

    expect(component.imageIdsFormControl.setValue).toHaveBeenCalledWith([]);
    expect(component.decodedImages.length).toBe(0);
    expect(component.selectedImages.length).toBe(0);
  });

  it('should call fileChangeEvent when file input changes', () => {
    const fileChangeEventSpy = jest.spyOn(component, 'fileChangeEvent');

    mockEvent = {
      target: {
        files: [new Blob(['image'], { type: 'image/jpeg' })]
      }
    } as unknown as Event;

    component.fileChangeEvent(mockEvent);

    expect(fileChangeEventSpy).toHaveBeenCalled();
  });

  it('should dispatch ShowMessageBar action with small image', () => {
    const expectedMessageBar = new ShowMessageBar({
      message: SnackbarText.errorForSmallImg,
      type: 'error'
    });

    imgMock = { onload: jest.fn(), src: 'test', width: 10, height: 10 };

    window.FileReader = jest.fn(() => fileReaderMock) as any;
    window.Image = jest.fn(() => imgMock) as any;

    component.fileChangeEvent(mockEvent);
    fileReaderMock.onload({ target: { result: 'data:image/jpeg;base64' } });
    imgMock.onload();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(expectedMessageBar);
  });

  it('should dispatch ShowMessageBar action with big image', () => {
    const expectedMessageBar = new ShowMessageBar({
      message: SnackbarText.errorForBigImg,
      type: 'error'
    });

    imgMock = { onload: jest.fn(), src: 'test', width: 300, height: 300 };

    window.FileReader = jest.fn(() => fileReaderMock) as any;
    window.Image = jest.fn(() => imgMock) as any;

    component.fileChangeEvent(mockEvent);
    fileReaderMock.onload({ target: { result: 'data:image/jpeg;base64' } });
    imgMock.onload();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(expectedMessageBar);
  });

  it('should openCropperModal', () => {
    imgMock = { onload: jest.fn(), src: 'test', width: 150, height: 150 };

    window.FileReader = jest.fn(() => fileReaderMock) as any;
    window.Image = jest.fn(() => imgMock) as any;

    const openCropperModalSpy = jest.spyOn(component, 'openCropperModal');

    component.fileChangeEvent(mockEvent);
    fileReaderMock.onload({ target: { result: 'data:image/jpeg;base64' } });
    imgMock.onload();

    expect(openCropperModalSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should decode the image and call the provided callback', () => {
    const mockFile = new Blob(['image content'], { type: 'image/jpeg' });
    const onLoadCallback = jest.fn();

    const mockFileReader = {
      onload: null,
      readAsDataURL: function (file: Blob) {
        this.onload({
          target: { result: 'data:image/jpeg;base64' }
        });
      }
    };

    (window as any).FileReader = jest.fn(() => mockFileReader);

    component.imageDecoder(mockFile, onLoadCallback);

    expect(onLoadCallback).toHaveBeenCalledWith({
      target: { result: 'data:image/jpeg;base64' }
    });
  });

  it('should set grid columns based on screen width', () => {
    const largeScreen = { innerWidth: 600 } as Window;
    const smallScreen = { innerWidth: 300 } as Window;

    component.onResize(largeScreen);
    expect(component.gridCols).toBe(4);

    component.onResize(smallScreen);
    expect(component.gridCols).toBe(2);
  });

  it('should handle writeValue without errors', () => {
    expect(() => component.writeValue(null)).not.toThrow();
  });
});

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isDirtyForm: false,
    isEditMode: false,
    isMobileScreen: undefined
  }
})
@Injectable()
export class MockAppState {}
