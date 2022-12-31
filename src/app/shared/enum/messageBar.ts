export enum messageType {
  success = 'done',
  warningYellow = 'priority_high',
  warningBlue = 'priority_high',
  error = 'close'
}

export enum messageStatus {
  left = 'Гурток успішно залишено',
  approved = 'Статус заявки успішно змінено',
  rejected = 'Заявку успішно відхилено'
}

export enum SnackbarText {
  createWorkshop = 'Дякуємо! Новий гурток успішно доданий.',
  updateWorkshop = 'Гурток оновлено!',
  deleteWorkshop = 'Дякуємо! Гурток видалено!',
  deletedWorkshop = 'Даний гурток видалено!',

  addedWorkshopFavorite = 'Гурток додано до Улюблених',
  deleteWorkshopFavorite = 'Гурток видалено з Улюблених',

  deleteNotification = 'Сповіщення успішно видалено!',

  createDirection = 'Напрямок успішно створений',
  updateDirection = 'Напрямок успішно відредагований',
  deleteDirection = 'Напрямок видалено!',

  createMinistryAdminSuccess = 'Адміністратор міністерства успішно створено',
  createMinistryAdminFail = 'На жаль виникла помилка при створенні адміністратора міністерства',
  updateMinistryAdmin = 'Адміністратор міністерства успішно відредагований',
  deleteMinistryAdmin = 'Адміна міністерства видалено!',
  blockMinistryAdmin = 'Дякуємо! Адміністратора міністерства заблоковано!',

  createChild = 'Дякуємо! Дитина була успішно додана.',
  updateChild = 'Дитина успішно відредагована',
  deleteChild = 'Дитину видалено!',

  createAchievement = 'Нове досягнення додано!',
  updateAchievement = 'Досягнення успішно відредаговано!',
  deleteAchievement = 'Досягнення видалено!',

  createProviderAdminSuccess = 'Адміністратора гуртка успішно створено!',
  createProviderAdminFail = 'На жаль виникла помилка при створенні адміністратора гуртка!',
  updateProviderAdmin = 'Адміністратора гуртка успішно відредаговано!',
  deleteProviderAdmin = 'Дякуємо! Користувача видалено!',

  createApplication = 'Заявку створено!',
  applicationLimit = 'Перевищено ліміт заявок. Спробуйте ще раз пізніше.',
  applicationLimitPerPerson = 'Користувач може подати не більше 2-х заяв в тиждень на людину',

  createProvider = 'Організацію успішно створено',
  updateProvider = 'Організація успішно відредагована',
  deleteProvider = 'Організація успішно видалена',
  changeProviderStatus = 'Статус успішно змінений',
  statusEditing = 'Організацію відправлено на редагування',
  licenseApproved = 'Ліцензія успішно підтвердженна',

  createDeputy = 'Заступника директора успішно створено!',
  updateDeputy = 'Заступника директора успішно відредаговано!',

  createRating = 'Оцінка успішно поставлена!',

  updatePortal = 'Інформація про портал успішно відредагована',

  updateUser = 'Особиста інформація успішно відредагована!',

  blockPerson = 'Користувач успішно заблокований!',
  unblockPerson = 'Користувач успішно розблокований!',

  error = 'На жаль, виникла помилка',
  error404 = 'Надіслано неправильний запит',
  error403 = 'Доступ заборонено',
  error401 = 'Користувач не зареєстрований',
  error500 = 'Помилка сервера',
  errorEmail = 'Перевірте введені дані. Користувач з такою електронною поштою вже існує',
  notUniqueData = 'Перевірте введені дані. Електрона пошта, номер телефону та ІПН/ЄДПРО мають бути унікальними',
  mapWarning = 'Важливо! Тільки 100 найближчих гуртків будуть відображені на карті.'
}
