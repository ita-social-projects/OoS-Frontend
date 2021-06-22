import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageFormControlComponent } from './image-form-control.component';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule} from "@angular/material/grid-list";

describe('ImageFormControlComponent', () => {
  let component: ImageFormControlComponent;
  let fixture: ComponentFixture<ImageFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatGridListModule
      ],
      declarations: [ ImageFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
