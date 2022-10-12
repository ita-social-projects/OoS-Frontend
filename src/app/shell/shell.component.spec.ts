/* istanbul ignore file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShellComponent } from './shell.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { GeolocationService } from '../shared/services/geolocation/geolocation.service';
export class GeolocationServiceStub {
  handleUserLocation(): void {

  }
}

xdescribe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ShellComponent,
        MockNavigationBarComponent,
      ],
      providers: [
        { provide: GeolocationService, useValue: GeolocationServiceStub }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-navigation-bar',
  template: ''
})
class MockNavigationBarComponent { }
