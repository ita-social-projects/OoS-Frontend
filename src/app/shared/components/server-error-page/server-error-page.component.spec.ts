import { TimerData } from 'shared/models/server-error';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ServerErrorService } from 'shared/services/server-error/server-error.service';
import { Router } from '@angular/router';
import { Store, NgxsModule } from '@ngxs/store';
import { AppState } from 'shared/store/app.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServerErrorPageComponent } from './server-error-page.component';

describe('ServerErrorPageComponent', () => {
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
      dispatch: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AppState]), MatSnackBarModule],
      providers: [
        ServerErrorPageComponent,
        { provide: ServerErrorService, useValue: serverErrorMock },
        { provide: Router, useValue: routerMock },
        { provide: Store, useValue: storeMock }
      ]
    });
    component = TestBed.inject(ServerErrorPageComponent);
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
});
