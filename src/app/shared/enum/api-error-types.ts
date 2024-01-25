import { ApiError } from 'shared/models/error-response.model';
import { SnackbarText } from './enumUA/message-bar';

export namespace ApiErrorTypes {
  export enum GroupTitle {
    General = SnackbarText.errorGeneral,
    Common = SnackbarText.errorIncorrectInputData
  }

  export enum Common {
    EmailAlreadyTaken = SnackbarText.commonEmailAlreadyTaken,
    PhoneNumberAlreadyTaken = SnackbarText.phoneNumberAlreadyTaken
  }

  export enum ProviderAdmin {
    UserDontHavePermissionToCreate = SnackbarText.providerAdminUserDontHavePermissionToCreate
  }

  export function apiErrorExists(apiError: ApiError): boolean {
    return apiError.group in ApiErrorTypes && apiError.code in ApiErrorTypes[apiError.group];
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
    return ApiErrorTypes[apiError.group][apiError.code];
  }
}
