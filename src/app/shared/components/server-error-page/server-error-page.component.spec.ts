import { TimerData } from 'shared/models/server-error';
import { of } from 'rxjs';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ServerErrorService } from 'shared/services/server-error/server-error.service';
import { Router } from '@angular/router';
import { Store, NgxsModule } from '@ngxs/store';
import { AppState } from 'shared/store/app.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SetErrorTimerData } from 'shared/store/app.actions';
import { TranslateModule } from '@ngx-translate/core';
import { ServerErrorPageComponent } from './server-error-page.component';

describe('ServerErrorPageComponent', () => {
  let fixture: ComponentFixture<ServerErrorPageComponent>;
  let component: ServerErrorPageComponent;
  let serverErrorMock: any;
  let routerMock: any;
  let storeMock: any;

  beforeEach(() => {
    // Mocking the services
    serverErrorMock = {
      checkHealth: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };
    storeMock = {
      dispatch: jest.fn(),
      select: jest.fn().mockReturnValue(of({ time: 10 }))
    };

    TestBed.configureTestingModule({
      declarations: [ServerErrorPageComponent],
      imports: [NgxsModule.forRoot([AppState]), MatSnackBarModule, TranslateModule.forRoot()],
      providers: [
        { provide: ServerErrorService, useValue: serverErrorMock },
        { provide: Router, useValue: routerMock },
        { provide: Store, useValue: storeMock }
      ]
    });
    fixture = TestBed.createComponent(ServerErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize isDisabled and set timerData correctly', () => {
    const mockTimerData: TimerData = { timerValue: 1000, time: Date.now() }; // Mock timer data
    component.timerData = mockTimerData;

    // Verifying that values are initialized correctly
    setTimeout(() => {
      expect(component.isDisabled).toBe(false); // isDisabled should be false by default
      expect(component.timerData).toEqual(mockTimerData); // Verifying that timerData is set correctly

      // Simulating that the service returns a healthy response
      serverErrorMock.checkHealth.mockReturnValue(of({ status: 'Healthy' }));
    }, mockTimerData.timerValue);
  });

  it('should set disabledTime and navigate when server is available', () => {
    const mockTimerData: TimerData = { timerValue: 1000, time: 0 }; // Mock timer data
    component.timerData = mockTimerData;

    // Simulating a successful server response
    serverErrorMock.checkHealth.mockReturnValue(of({ status: 'Healthy' }));

    // Running the method
    component.checkServerAvailable();

    // Verifying that disabledTime is set correctly (5 seconds)
    expect(component.disabledTime).toBe(1);

    // Verifying that the router navigation happens
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call dispatch and set isDisabled to false after timer completes', fakeAsync(() => {
    const mockTimerData: TimerData = { timerValue: 2000, time: 0 }; // Mock timer data with 3 seconds
    component.timerData = mockTimerData;
    component.disabledTime = 2; // Set initial disabled time

    // Spy on store.dispatch to see if it gets called
    const dispatchSpy = jest.spyOn(storeMock, 'dispatch');

    // Start the timer
    component.setTimerData();

    // Simulate the passage of time
    tick(3000); // Simulate the 3 seconds

    // Verify the dispatch was called with the correct values
    expect(dispatchSpy).toHaveBeenCalledWith(new SetErrorTimerData(mockTimerData));

    // Verify that isDisabled is set to false after the timer completes
    expect(component.isDisabled).toBe(false);
  }));
});
