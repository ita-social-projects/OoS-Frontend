import { Component, OnInit } from '@angular/core';
import { Address } from 'src/app/shared/models/address.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

export interface Tile {
  text: string;
}

export interface Provider {
  fullTitle?: string;
  edrpouIpn?: string;
  director?: string;
  phoneNumber?: string;
  founder?: string;
  ownership?: string;
  type?: number;
  status?: string;
  legalAddress?: string;
  city: string
}

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  tiles: Tile[] = [
    { text: 'Назва закладу' },
    { text: 'Форма власності' },
    { text: 'Ліцензія №' },
    { text: 'Населений пункт' },
    { text: 'Адреса' },
    { text: 'Директор' },
    { text: 'Статус' },
  ];
  providers: Provider[] = [
    {
      fullTitle: 'ДНУ ім.Гончара',
      ownership: 'Державна',
      edrpouIpn: '3897653',
      city: 'Київ',
      legalAddress: 'вул.Рокосовського 1',
      director: 'Антонів',
      status: 'Очікує логування',
    },
    {
      fullTitle: 'ДНУ ім.Гончара',
      ownership: 'Державна',
      edrpouIpn: '3897653',
      city: 'Київ',
      legalAddress: 'вул.Рокосовського 1',
      director: 'Антонів',
      status: 'Очікує логування',
    },
    {
      fullTitle: 'ДНУ ім.Гончара',
      ownership: 'Державна',
      edrpouIpn: '3897653',
      city: 'Київ',
      legalAddress: 'вул.Рокосовського 1',
      director: 'Антонів',
      status: 'Очікує логування',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
