export interface orgCard {
  title: string;
  owner: string;
  city: string;
  ownership: string;
  price: number | boolean;
  rate: string; //temp
  ageFrom: number;
  ageTo: number;
  category: string[];
}

export const ORGCARDS: orgCard[] = [
  {
    title: 'Творчий гурток',
    owner: 'ЦТДЮ 13',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '*****',
    ageFrom: 7,
    ageTo: 13,
    category: ['Дошкільна підготовка', 'Музика', 'Драмматургія']
  },
  {
    title: 'Гра на гітарі',
    owner: 'Петренво О.В',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '****',
    ageFrom: 7,
    ageTo: 16,
    category: ['Музика']
  },
  {
    title: 'Волейбол',
    owner: 'ДЮСШ 5',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '*****',
    ageFrom: 7,
    ageTo: 13,
    category: ['Спорт']
  },
  {
    title: 'Читання',
    owner: 'ЦТДЮ 13',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '*****',
    ageFrom: 7,
    ageTo: 13,
    category: ['Дошкільна підготовка']
  },
  {
    title: 'Творчий гурток',
    owner: 'ЦТДЮ 13',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '*****',
    ageFrom: 7,
    ageTo: 13,
    category: ['Дошкільна підготовка', 'Музика', 'Драмматургія']
  },
  {
    title: 'Гра на гітарі',
    owner: 'Петренво О.В',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '****',
    ageFrom: 7,
    ageTo: 16,
    category: ['Музика']
  },
  {
    title: 'Волейбол',
    owner: 'ДЮСШ 5',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '*****',
    ageFrom: 7,
    ageTo: 13,
    category: ['Спорт']
  },
  {
    title: 'Читання',
    owner: 'ЦТДЮ 13',
    city: 'КиЇв',
    ownership: 'Державний',
    price: false,
    rate: '*****',
    ageFrom: 7,
    ageTo: 13,
    category: ['Дошкільна підготовка']
  }
];