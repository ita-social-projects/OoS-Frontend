export enum ModalConfirmationType {
  delete = 'delete',
  deleteDirection = 'deleteDirection',
  leaveWorkshop = 'leaveWorkshop',
  deleteChild = 'deleteChild',
  leavePage = 'leavePage',
  rate = 'rate',
  createApplication = 'createApplication',
  approveApplication = 'approveApplication',
  rejectApplication = 'rejectApplication',
  createDirection = 'createDirection',
  createDepartment = 'createDepartment',
}
export enum ModalConfirmationTitle {
  delete = 'ВИДАЛИТИ ГУРТОК?',
  deleteDirection = 'ВИДАЛИТИ НАПРЯМОК?',
  createDirection = 'CТВОРИТИ НАПРЯМОК?',
  createDepartment = 'CТВОРИТИ ВІДДІЛЕННЯ?',
  deleteChild = 'ВИЛУЧИТИ ДАНІ ПРО ДИТИНУ?',
  leaveWorkshop = 'ЗАЛИШИТИ ГУРТОК?',
  leavePage = 'ЗАЛИШИТИ СТОРІНКУ?',
  createApplication = 'ПОДАТИ ЗАЯВКУ?',
  approveApplication = 'ЗАРАХУВАТИ',
  rejectApplication = 'ВІДМОВИТИ',
}

export enum ModalConfirmationText {
  delete = 'Ви впевнені, що хочете видалити гурток',
  deleteDirection = 'Ви впевнені, що хочете видалити напрямок',
  createDirection = 'Ви впевнені, що хочете створити напрямок?',
  createDepartment = 'Ви впевнені, що хочете створити відділення?',
  deleteChild = 'Ви впевнені, що хочете вилучити дані про дитину',
  leaveWorkshop = 'Ви впевнені, що хочете залишити гурток',
  leavePage = 'Ви впевнені, що хочете залишити сторінку?',
  rate = 'Поставте будь ласка оцінку цьому гуртку',
  createApplication = 'Ви впевнені, що хочете подати заявку у гурток',
  approveApplication = 'Ви впевнені, що хочете перевести заявку в статус "Зарахувати"?',
  rejectApplication = 'Ви впевнені, що хочете перевести заяву у статус ”Відмовлено”?',
}
