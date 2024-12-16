import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ServerErrorService } from 'shared/services/server-error/server-error.service';
import { Router } from '@angular/router';
import { ServerErrorPageComponent } from './server-error-page.component';

describe('ServerErrorPageComponent', () => {
  let component: ServerErrorPageComponent;
  let serverErrorMock: any;
  let routerMock: any;

  beforeEach(() => {
    serverErrorMock = {
      isButtonDisabled$: of(false),
      serverIsAvailable: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ServerErrorPageComponent,
        { provide: ServerErrorService, useValue: serverErrorMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    component = TestBed.inject(ServerErrorPageComponent);
  });

  it('should initialize isDisabled with the value from errorService', () => {
    serverErrorMock.isButtonDisabled$ = of(true);
    component.ngOnInit();
    expect(component.isDisabled).toBe(true);
  });

  it('should set disabledTime and navigate when server is available', async () => {
    serverErrorMock.serverIsAvailable.mockReturnValue({
      status: Promise.resolve({ status: 'Healthy' }),
      timerValue: 5000
    });

    await component.checkServerAvailable();

    expect(component.disabledTime).toBe(5);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should throw an error if server check fails', async () => {
    serverErrorMock.serverIsAvailable.mockImplementation(() => {
      throw new Error('Server error');
    });

    await expect(component.checkServerAvailable()).rejects.toThrow('Server error');
  });
});
