/* eslint-disable @typescript-eslint/no-shadow */
import { ApiError } from 'shared/models/error-response.model';
import { SnackbarText } from './enumUA/message-bar';

export namespace ApiErrorTypes {
  export enum GroupTitle {
    General = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.GENERAL',
    Common = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.INCORRECT_INPUT_DATA'
  }

  export enum Common {
    EmailAlreadyTaken = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.COMMON.EMAIL_ALREADY_TAKEN',
    PhoneNumberAlreadyTaken = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.COMMON.PHONE_NUMBER_ALREADY_TAKEN'
  }

  export enum ProviderAdmin {
    UserDontHavePermissionToCreate = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.PROVIDER_ADMIN.USER_DONT_HAVE_PERMISSION_TO_CREATE'
  }

  // TODO: Change group & code according to future backend contributions
  export enum Provider {
    WorkshopSeatsLack = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.PROVIDER.WORKSHOP_SEATS_LACK'
  }

  export function toApiErrorMap(apiErrors: ApiError[]): Map<string, ApiError[]> {
    return apiErrors.reduce((apiErrorMap, apiError) => {
      const group = apiError.group;
      const errorGroup = apiErrorMap.get(group);

      if (errorGroup) {
        errorGroup.push(apiError);
      } else {
        apiErrorMap.set(group, [apiError]);
      }

      return apiErrorMap;
    }, new Map<string, ApiError[]>());
  }

  export function toErrorMessage(apiError: ApiError): string {
    return apiErrorExists(apiError) ? ApiErrorTypes[apiError.group][apiError.code] : null;
  }

  export function apiErrorExists(apiError: ApiError): boolean {
    return apiError.group in ApiErrorTypes && apiError.code in ApiErrorTypes[apiError.group];
  }
}
