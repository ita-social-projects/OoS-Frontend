import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NgxsModule, Store } from '@ngxs/store';
import { NotificationDescriptionPipe } from './notification-description.pipe';

describe('NotificationDescriptionPipe', () => {
  let pipe: NotificationDescriptionPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgxsModule.forRoot([])]
    }).compileComponents();
  });

  beforeEach(() => {
    const translateService = TestBed.inject(TranslateService);
    const store = TestBed.inject(Store);
    pipe = new NotificationDescriptionPipe(translateService, store);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
