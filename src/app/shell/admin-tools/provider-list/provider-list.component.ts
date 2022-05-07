import { Component, OnInit } from '@angular/core';

export interface Tile {
  text: string;
}
@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  tiles: Tile[] = [
    { text: 'Назва закладу' },
    { text: 'Форма власності',  },
    { text: 'Ліцензія №',  },
    { text: 'Населений пункт',  },
    { text: 'Адреса', },
    { text: 'Директор',  },
    { text: 'Статус', },
  ];
  providers: Tile[] = [
    { text: 'ДНУ ім.Гончара', },
    { text: 'Державна', },
    { text: '3897653', },
    { text: 'Київ', },
    { text: 'вул.Рокосовського 1', },
    { text: 'Антонів', },
    { text: 'Очікує логування' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
