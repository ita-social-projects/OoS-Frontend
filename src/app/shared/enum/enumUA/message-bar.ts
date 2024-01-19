export enum messageStatus {
  left = 'SERVICE_MESSAGES.MESSAGE_STATUS.LEFT',
  approved = 'SERVICE_MESSAGES.MESSAGE_STATUS.APPROVED',
  rejected = 'SERVICE_MESSAGES.MESSAGE_STATUS.REJECTED'
}

export enum SnackbarText {
  createWorkshop = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_WORKSHOP',
  updateWorkshop = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_WORKSHOP',
  deleteWorkshop = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETE_WORKSHOP',
  deletedWorkshop = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETED_WORKSHOP',

  addedWorkshopFavorite = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ADDED_FAV_WORKSHOP',
  deleteWorkshopFavorite = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETED_FAV_WORKSHOP',

  deleteNotification = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETED_NOTIFICATION',

  createDirection = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_DIRECTION',
  updateDirection = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_DIRECTION',
  deleteDirection = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETE_DIRECTION',

  createAdminSuccess = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_ADMIN_SUCCESS',
  createAdminFail = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_ADMIN_FAIL',
  updateAdmin = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_ADMIN',
  deleteAdmin = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETE_ADMIN',
  blockAdmin = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.BLOCK_ADMIN',

  createChild = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_CHILD',
  createChildren = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_CHILDREN',
  updateChild = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_CHILD',
  deleteChild = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETE_CHILD',

  createAchievement = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_ACHIEVEMENT',
  updateAchievement = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_ACHIEVEMENT',
  deleteAchievement = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETE_ACHIEVEMENT',

  createProviderAdminSuccess = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_PROVIDER_ADMIN_SUCCESS',
  createProviderAdminFail = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_PROVIDER_ADMIN_FAIL',
  updateProviderAdmin = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_PROVIDER_ADMIN',
  deleteProviderAdmin = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETE_PROVIDER_ADMIN',

  //todo: check this flow
  createApplication = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_APPLICATION',
  applicationLimit = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.APPLICATION_LIMIT',
  applicationLimitPerPerson = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.APPLICATION_LIMIT_PER_PERSON',

  createProvider = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_PROVIDER',
  updateProvider = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_PROVIDER',
  deleteProvider = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.DELETE_PROVIDER',
  changeProviderStatus = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_PROVIDER_STATUS',
  statusEditing = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_PROVIDER_STATUS_EDITING',
  licenseApproved = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_PROVIDER_LICENSE_APPROVED',

  createDeputy = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_PROVIDER_DEPUTY',
  updateDeputy = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_PROVIDER_DEPUTY',

  completeRegistration = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.COMPLETE_PROVIDER_REGISTRATION',

  createRating = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.CREATE_RATING',

  updatePortal = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_PORTAL',

  updateUser = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UPDATE_USER',

  blockPerson = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.BLOCK_USER',
  unblockPerson = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.UNBLOCK_USER',

  sendInvitation = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.SEND_INVITATION',

  error = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR',
  error401 = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_401',
  error404 = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_404',
  error403 = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_403',
  error500 = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_500',

  errorEmail = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_MAIL',
  notUniqueData = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.NOT_UNIQUE_DATA',
  mapWarning = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.MAP_WARNING',
  geolocationWarning = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.GEOLOCATION_WARNING',

  errorGeneral = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.GENERAL',
  errorIncorrectInputData = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.INCORRECT_INPUT_DATA',

  commonEmailAlreadyTaken = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.COMMON.EMAIL_ALREADY_TAKEN',

  providerAdminUserDontHavePermissionToCreate = 'SERVICE_MESSAGES.SNACK_BAR_TEXT.ERROR_RESPONSE.PROVIDER_ADMIN.USER_DONT_HAVE_PERMISSION_TO_CREATE'
}
