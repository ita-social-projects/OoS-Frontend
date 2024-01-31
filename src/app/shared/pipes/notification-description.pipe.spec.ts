import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NotificationDescriptionPipe } from './notification-description.pipe';

describe('NotificationDescriptionPipe', () => {
  let pipe: NotificationDescriptionPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    const translateService = TestBed.inject(TranslateService);
    pipe = new NotificationDescriptionPipe(translateService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
