export enum ApplicationTitles {
  Pending = 'Очікують підтвердження',
  AcceptedForSelection = 'Прийнято до конкурсного відбору',
  Approved = 'Зараховано',
  Rejected = 'Відмовлено',
  Left = 'Гурток залишено'
}

export enum ApplicationTitlesReverse {
  'Очікують підтвердження' = 'Pending',
  'Прийнято до конкурсного відбору' = 'AcceptedForSelection',
  'Зараховано' = 'Approved',
  'Відмовлено' = 'Rejected',
  'Гурток залишено' = 'Left'
}

export enum ApplicationStatusDescription {
  Pending = 'Нова створена заява, яка очікує підтвердження від надавача послуг',
  AcceptedForSelection = 'Користувача прийнято до конкурсного відбору (з додатковою інформацією про відбір)',
  Approved = 'Заява підтверджена/користувача зараховано до гуртка/секції/школи',
  Rejected = 'Користувачеві відмовлено у зарахуванні з причиною',
  Left = 'Користувач покинув гурток самостійно'
}
