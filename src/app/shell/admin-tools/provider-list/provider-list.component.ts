import { Component, OnInit } from '@angular/core';

export interface Tile {  
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  tiles: Tile[] = [
    { text: 'Назва закладу', cols: 1, rows: 1 },
    { text: 'Форма власності', cols: 1, rows: 1 },
    { text: 'Ліцензія №', cols: 1, rows: 1 },
    { text: 'Населений пункт', cols: 1, rows: 1 },
    { text: 'Адреса', cols: 1, rows: 1 },
    { text: 'Директор', cols: 1, rows: 1 },
    { text: 'Статус', cols: 1, rows: 1 },
  ];

  constructor() {}

  ngOnInit(): void {}
}
