import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TranslateCasesPipe } from './translate-cases.pipe';

describe('TranslateCasesPipe', () => {
  let pipe: TranslateCasesPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  });

  beforeEach(() => {
    const translateService = TestBed.inject(TranslateService);
    pipe = new TranslateCasesPipe(translateService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
