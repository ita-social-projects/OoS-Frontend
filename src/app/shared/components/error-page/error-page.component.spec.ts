import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ErrorPageComponent } from './error-page.component';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [ErrorPageComponent]
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.onBack();
    expect(component).toBeTruthy();
  });

  it('should execute router navigate', () => {
    const routerSpy = jest.spyOn(router, 'navigate');

    component.onBack();

    expect(routerSpy).toHaveBeenCalledWith(['']);
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });

  it('should execute router navigate when click on the button', () => {
    const button = fixture.debugElement.query(By.css('[data-testid="button"]'));
    const routerSpy = jest.spyOn(router, 'navigate');

    button.nativeElement.click();

    expect(routerSpy).toHaveBeenCalledWith(['']);
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });
});
