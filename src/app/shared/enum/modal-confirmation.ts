export enum ModalConfirmationType {
  delete = 'delete',
  deleteDirection = 'deleteDirection',
  deleteTeacher = 'deleteTeacher',
  deleteProvider = 'deleteProvider',
  deleteProviderAdmin = 'deleteProviderAdmin',
  deleteProviderAdminDeputy = 'deleteProviderAdminDeputy',
  blockProviderAdmin = 'blockProviderAdmin',
  blockProviderAdminDeputy = 'blockProviderAdminDeputy',
  editingProvider = 'editingProvider',
  unBlockProviderAdmin = 'unBlockProviderAdmin',
  unBlockProviderAdminDeputy = 'unBlockProviderAdminDeputy',
  leaveWorkshop = 'leaveWorkshop',
  deleteChild = 'deleteChild',
  deleteAchievement = 'deleteAchievement',
  leavePage = 'leavePage',
  leaveRegistration = 'leaveRegistration',
  rate = 'rate',
  createApplication = 'createApplication',
  approveApplication = 'approveApplication',
  rejectApplication = 'rejectApplication',
  createAchievement = 'createAchievement',
  createDirection = 'createDirection',
  editDirection = 'editDirection',
  createProviderAdmin = 'createProviderAdmin',
  createProviderAdminDeputy = 'createProviderAdminDeputy',
  updateProviderAdmin = 'updateProviderAdmin',
  updateProviderAdminDeputy = 'updateProviderAdminDeputy',
  unBlockParent = 'unBlockParent',
  blockParent = 'blockParent',
  reject = 'reject',
  closeSet = 'closeSet',
  openSet = 'openSet',
  deleteMinistryAdmin = 'deleteMinistryAdmin',
  blockMinistryAdmin = 'blockMinistryAdmin',
  unBlockMinistryAdmin = 'unBlockMinistryAdmin',
  createMinistryAdmin = 'createMinistryAdmin',
  updateMinistryAdmin = 'updateMinistryAdmin'
}
export enum ModalConfirmationTitle {
  delete = 'ВИДАЛИТИ ГУРТОК?',
  deleteDirection = 'ВИДАЛИТИ НАПРЯМОК?',
  createDirection = 'CТВОРИТИ НАПРЯМОК?',
  createAchievement = 'ДОДАТИ ДОСЯГНЕННЯ?',
  editDirection = 'РЕДАГУВАТИ НАПРЯМОК?',
  deleteChild = 'ВИЛУЧИТИ ДАНІ ПРО ДИТИНУ?',
  deleteTeacher = 'ВИЛУЧИТИ ДАНІ ПРО ВЧИТЕЛЯ?',
  deleteProvider = 'ВИДАЛИТИ ЗАКЛАД?',
  deleteProviderAdmin = 'ВИДАЛИТИ АДМІНІСТРАТОРА ГУРТКА?',
  deleteProviderAdminDeputy = 'ВИДАЛИТИ ЗАСТУПНИКА ДИРЕКТОРА?',
  blockProviderAdmin = 'БЛОКУВАТИ АДМІНІСТРАТОРА ГУРТКА?',
  blockProviderAdminDeputy = 'БЛОКУВАТИ ЗАСТУПНИКА ДИРЕКТОРА?',
  editingProvider = 'ВІДПРАВИТИ НА РЕДАГУВАННЯ?',
  unBlockProviderAdmin = 'РОЗБЛОКУВАТИ АДМІНІСТРАТОРА ГУРТКА?',
  unBlockProviderAdminDeputy = 'РОЗБЛОКУВАТИ ЗАСТУПНИКА ДИРЕКТОРА?',
  leaveWorkshop = 'ЗАЛИШИТИ ГУРТОК?',
  leavePage = 'ЗАЛИШИТИ СТОРІНКУ?',
  deleteAchievement = 'ВИДАЛИТИ ДОСЯГНЕННЯ?',
  leaveRegistration = 'ПЕРЕРВАТИ РЕЄСТРАЦІЮ?',
  createApplication = 'ПОДАТИ ЗАЯВКУ?',
  approveApplication = 'ЗАРАХУВАТИ?',
  rejectApplication = 'ВІДМОВИТИ?',
  createProviderAdmin = 'ДОДАТИ АДМІНІСТРАТОРА ГУРТКА?',
  createProviderAdminDeputy = 'ДОДАТИ ЗАСТУПНИКА ДИРЕКТОРА?',
  updateProviderAdmin = 'РЕДАГУВАТИ АДМІНІСТРАТОРА ГУРТКА?',
  updateProviderAdminDeputy = 'РЕДАГУВАТИ ЗАСТУПНИКА ДИРЕКТОРА?',
  unBlockParent = 'РОЗБЛОКУВАТИ КОРИСТУВАЧА?',
  blockParent = 'ЗАБЛОКУВАТИ КОРИСТУВАЧА?',
  reject = 'ВІДМОВИТИ?',
  closeSet = 'Призупинити набір?',
  openSet = 'Відкрити набір?',
  deleteMinistryAdmin = 'ВИДАЛИТИ АДМІНІСТРАТОРА МІНІСТЕРСТВА?',
  blockMinistryAdmin = 'БЛОКУВАТИ АДМІНІСТРАТОРА МІНІСТЕРСТВА?',
  unBlockMinistryAdmin = 'РОЗБЛОКУВАТИ АДМІНІСТРАТОРА МІНІСТЕРСТВА?',
  createMinistryAdmin = 'ДОДАТИ АДМІНА МІНІСТЕРСТВА?',
  updateMinistryAdmin = 'РЕДАГУВАТИ АДМІНІСТРАТОРА МІНІСТЕРСТВА?'
}

export enum ModalConfirmationText {
  delete = 'Ви впевнені, що хочете видалити гурток?',
  deleteDirection = 'Ви впевнені, що хочете видалити напрямок?',
  deleteIClass = 'Ви впевнені, що хочете видалити клас?',
  createDirection = 'Ви впевнені, що хочете створити напрямок?',
  editDirection = 'Ви впевнені, що хочете відредагувати напрямок?',
  deleteChild = 'Ви впевнені, що хочете вилучити дані про дитину?',
  deleteAchievement = 'Ви впевнені, що хочете вилучити досягнення?',
  deleteTeacher = 'Ви впевнені, що хочете вилучити дані про вчителя?',
  deleteProvider = 'Ви впевнені, що хочете видалити заклад?',
  deleteProviderAdmin = 'Ви впевнені, що хочете видалити адміністратора гуртка?',
  deleteProviderAdminDeputy = 'Ви впевнені, що хочете видалити заступника директора?',
  blockProviderAdmin = 'Ви впевнені, що хочете блокувати адміністратора гуртка?',
  blockProviderAdminDeputy = 'Ви впевнені, що хочете блокувати заступника директора?',
  editingProvider = 'Ви впевнені, що хочете відправити заклад на редагування?',
  unBlockProviderAdmin = 'Ви впевнені, що хочете розблокувати адміністратора гуртка?',
  unBlockProviderAdminDeputy = 'Ви впевнені, що хочете розблокувати заступника директора?',
  leaveWorkshop = 'Ви впевнені, що хочете залишити гурток?',
  leavePage = 'Ви впевнені, що хочете залишити сторінку?',
  leaveRegistration = 'Ви впевнені, що хочете перервати реєстрацію? Ви зможете повернутися до неї пізніше',
  rate = 'Поставте, будь ласка, оцінку цьому гуртку',
  createApplication = 'Ви впевнені, що хочете подати заявку у гурток?',
  createAchievement = 'Ви впевнені, що хочете додати досягнення?',
  approveApplication = 'Ви впевнені, що хочете перевести заявку в статус "Зарахувати"?',
  rejectApplication = 'Ви впевнені, що хочете перевести заяву у статус ”Відмовлено”?',
  createProviderAdmin = 'Ви впевнені, що хочете додати адміністратора гуртка?',
  createProviderAdminDeputy = 'Ви впевнені, що хочете додати заступника директора?',
  updateProviderAdmin = 'Ви впевнені, що хочете редагувати адміністратора гуртка?',
  updateProviderAdminDeputy = 'Ви впевнені, що хочете редагувати заступника директора?',
  unBlockParent = 'Ви впевнені, що хочете розблокувати користувача?',
  blockParent = 'Ви впевнені, що хочете заблокувати користувача?',
  reject = 'Ви впевнені, що хочете перевести заяву у статус ”Відмовлено”?',
  closeSet = 'Ви впевнені, що хочете призупинити набір?',
  openSet = 'Ви впевнені, що хочете відкрити набір?',
  deleteMinistryAdmin = 'Ви впевнені, що хочете видалити адміністратора міністерства?',
  blockMinistryAdmin = 'Ви впевнені, що хочете заблокувати адміністратора міністерства?',
  unBlockMinistryAdmin = 'Ви впевнені, що хочете розблокувати адміністратора міністерства?',
  createMinistryAdmin = 'Ви впевнені, що хочете додати адміна міністерства?',
  updateMinistryAdmin = 'Ви впевнені, що хочете редагувати адміністратора міністерства?'
}

export enum ModalConfirmationDescription {
  blockParent = 'Вкажіть причину блокування',
  reject = 'Вкажіть причину відмови',
  editingProvider = 'Вкажіть причину редагування'
}
