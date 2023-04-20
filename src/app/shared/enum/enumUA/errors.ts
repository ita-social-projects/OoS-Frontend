export enum CodeMessageErrors {
  InvalidResolutionError = 'Неправильна ширина або висота зображення',
  UploadingError = 'Помилка під час завантаження',
  RemovingError = 'Помилка видалення',
  ImageStorageError = 'Помилка виконання',
  ImageNotFoundError = 'Зображення не знайдено',
  UnexpectedValidationError = 'Помилка валідації',
  InvalidSizeError = 'Некоректний розмір зображення',
  InvalidFormatError = 'Некоректний формат зображення',
  ExceedingCountOfImagesError = 'Перевищено ліміт зображень',
  ImageAlreadyExist = 'Зображення вже існує'
}
