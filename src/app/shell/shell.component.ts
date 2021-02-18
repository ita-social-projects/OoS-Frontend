import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor() { }

  navigatorRecievedCoords(data): void {
    const crd = data.coords;
  //call action and send into it coords, remove console logs
    console.log('Ваше текущее метоположение:');
    console.log(`Широта: ${crd.latitude}`);
    console.log(`Долгота: ${crd.longitude}`);
    console.log(`Плюс-минус ${crd.accuracy} метров.`);
  };

  navigatorRecievedError(err): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(this.navigatorRecievedCoords, this.navigatorRecievedError);
  }

}