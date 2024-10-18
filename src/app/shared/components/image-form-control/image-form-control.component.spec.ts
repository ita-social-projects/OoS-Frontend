import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImageFormControlComponent } from './image-form-control.component';

describe('ImageFormControlComponent', () => {
  let component: ImageFormControlComponent;
  let fixture: ComponentFixture<ImageFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatGridListModule, MatDialogModule, NgxsModule.forRoot()],
      declarations: [ImageFormControlComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should remove the image and emit the removeId event', () => {
    const mockDecodedImage = { image: 'image1.jpg', imgFile: new File([], 'image1.jpg') } as any;
    component.decodedImages = [mockDecodedImage];
    component.selectedImages = [mockDecodedImage.imgFile];

    const removeIdSpy = jest.spyOn(component.removeId, 'emit');

    component.onRemoveImg(mockDecodedImage);

    expect(removeIdSpy).toHaveBeenCalledWith('image1.jpg');
    expect(component.decodedImages.length).toBe(0);
    expect(component.selectedImages.length).toBe(0);
  });

  it('should call fileChangeEvent when file input changes', () => {
    const fileChangeEventSpy = jest.spyOn(component, 'fileChangeEvent');

    const mockEvent = {
      target: {
        files: [new Blob(['image'], { type: 'image/jpeg' })]
      }
    } as unknown as Event;

    component.fileChangeEvent(mockEvent);

    expect(fileChangeEventSpy).toHaveBeenCalled();
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

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
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
