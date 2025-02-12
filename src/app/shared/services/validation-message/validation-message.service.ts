import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValidationMessageConfig, ValidationMessages, ValidationParams } from 'shared/constants/validation-messages';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {
  private readonly messages = new ValidationMessages();

  constructor(private readonly translateService: TranslateService) {}

  public getMessage(errorKey: string, params?: Partial<ValidationParams>): string {
    const config: ValidationMessageConfig = this.messages.messageConfigs[errorKey];

    if (errorKey === 'invalidFieldLength') {
      return this.getInvalidFieldLengthMessage(params);
    }

    if (config) {
      let result = '';

      if (config.base) {
        result += this.translateService.instant(config.base, params) + ' ';
      }
      if (config.detail) {
        result += this.translateService.instant(config.detail, params);
      }
      if (config.parts && Array.isArray(config.parts)) {
        const parts = config.parts
          .map((part) => this.translateService.instant(part, params))
          .map((translatedPart) => translatedPart.toLowerCase());
        result += parts.join(' ');
      }
      return result.trim();
    }

    return this.translateService.instant(errorKey, params);
  }

  private getInvalidFieldLengthMessage(params?: Partial<ValidationParams>): string {
    if (!params) {
      return '';
    }

    let result = this.translateService.instant('FORMS.VALIDATIONS.INVALID_VALUE_START_WITHOUT_PARAM') + ' ';

    if (params.minCharacters) {
      result += `${this.translateService.instant('FROM').toLowerCase()} ${params.minCharacters} `;
      result += `${this.translateService.instant('TO').toLowerCase()} `;
    } else {
      result += this.translateService.instant('NO_MORE_THAN') + ' ';
    }

    result += `${params.maxCharacters} ${this.translateService.instant('FORMS.VALIDATIONS.INVALID_LENGTH_END')} `;

    if (params.currentCharactersCount) {
      result += `${this.translateService.instant('FORMS.VALIDATIONS.CURRENT_COUNT')} ${params.currentCharactersCount}. `;
    }

    return result.trim();
  }
}
