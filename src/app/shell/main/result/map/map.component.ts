import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() data: Observable<Object[]>;
  public hobbyGroups: Array<Object> = [];

  constructor() { }

  ngOnInit(): void {
    this.data.subscribe((groups) => this.hobbyGroups = groups);
  }

}
