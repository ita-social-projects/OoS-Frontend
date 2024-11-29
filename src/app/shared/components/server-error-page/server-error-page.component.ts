import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerErrorService } from 'shared/services/server-error/server-error.service';

@Component({
  selector: 'app-server-error-page',
  templateUrl: './server-error-page.component.html',
  styleUrls: ['./server-error-page.component.scss']
})
export class ServerErrorPageComponent implements OnInit {
  public isDisabled!: boolean;
  public disabledTime: number = 0;

  constructor(
    private readonly errorService: ServerErrorService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.errorService.isButtonDisabled$.subscribe((res: boolean) => {
      this.isDisabled = res;
    });
  }

  public async checkServerAvailable(): Promise<any> {
    try {
      const { status, timerValue } = this.errorService.serverIsAvailable();
      this.disabledTime = timerValue / 1000;
      if ((await status).status === 'Healthy') {
        this.router.navigate(['/']);
      }
    } catch (err) {
      if (err) {
        throw err;
      }
    }
  }
}
