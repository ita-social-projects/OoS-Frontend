import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ValidationMessages, ValidationParams } from 'shared/constants/validation-messages';
import { ValidationErrorsEnum } from 'shared/enum/validation-errors';
import { ValidationMessageService } from './validation-message.service';

describe('ValidationMessageService', () => {
  let service: ValidationMessageService;
  let translateService: jest.Mocked<TranslateService>;

  beforeEach(() => {
    translateService = {
      instant: jest.fn()
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      providers: [ValidationMessageService, { provide: TranslateService, useValue: translateService }]
    });

    service = TestBed.inject(ValidationMessageService);
  });

  it('should return translated message for known error key', () => {
    const errorKey = ValidationErrorsEnum.InvalidEmail;
    translateService.instant.mockReturnValue('Translated message');

    const message = service.getMessage(errorKey);

    expect(translateService.instant).toHaveBeenCalledWith(ValidationMessages.INVALID_EMAIL, undefined);
    expect(message).toBe('Translated message');
  });

  it('should return correct message for invalidFieldLength with parameters', () => {
    const params: Partial<ValidationParams> = { minCharacters: '2', maxCharacters: '10', currentCharactersCount: '5' };

    translateService.instant.mockImplementation((key: string | string[]) => {
      const translations: Record<string, string> = {
        'FORMS.VALIDATIONS.INVALID_VALUE_START_WITHOUT_PARAM': 'Invalid length must be',
        FROM: 'from',
        TO: 'to',
        'FORMS.VALIDATIONS.INVALID_LENGTH_END': 'characters long.',
        'FORMS.VALIDATIONS.CURRENT_COUNT': 'Currently'
      };

      return translations[key as string] || (key as string);
    });

    const message = service.getMessage(ValidationErrorsEnum.InvalidFieldLength, params);

    expect(message).toBe('Invalid length must be from 2 to 10 characters long. Currently 5.');
  });

  it('should return key itself if no translation is found', () => {
    const unknownKey = 'unknown_error';
    translateService.instant.mockReturnValue(unknownKey);

    const message = service.getMessage(unknownKey);

    expect(translateService.instant).toHaveBeenCalledWith(unknownKey, undefined);
    expect(message).toBe(unknownKey);
  });
});
