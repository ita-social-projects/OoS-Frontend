export enum ApplicationTitles {
  Pending = 'Очікують підтвердження',
  AcceptedForSelection = 'Прийнято до конкурсного відбору',
  StudyingForYears = 'Навчається 1-11 років',
  Approved = 'Зараховано',
  Rejected = 'Відмовлено',
  Left = 'Гурток залишено',
  Completed = 'Навчання завершено'
}

export enum ApplicationTitlesReverse {
  'Очікують підтвердження' = 'Pending',
  'Прийнято до конкурсного відбору' = 'AcceptedForSelection',
  'Навчається 1-11 років' = 'StudyingForYears',
  'Зараховано' = 'Approved',
  'Відмовлено' = 'Rejected',
  'Гурток залишено' = 'Left',
  'Користувач завершив навчання' = 'Completed',
}

export enum ApplicationStatusDescription {
  Pending = 'Нова створена заява, яка очікує підтвердження від надавача послуг',
  AcceptedForSelection = 'Користувача прийнято до конкурсного відбору (з додатковою інформацією про відбір)',
  Approved = 'Заява підтверджена/користувача зараховано до гуртка/секції/школи',
  StudyingForYears = 'Користувач навчається в школі/гуртку 1 рік, 2 роки і т.д. і продовжує начатися',
  Rejected = 'Користувачеві відмовлено у зарахуванні з причиною',
  Left = 'Користувач покинув гурток самостійно',
  Completed = 'Користувач завершив навчання',
}
