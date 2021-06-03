import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentCreateChildComponent } from './parent-create-child.component';



describe('ParentCreateChildComponent', () => {
  let component: ParentCreateChildComponent;
  let fixture: ComponentFixture<ParentCreateChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentCreateChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentCreateChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
