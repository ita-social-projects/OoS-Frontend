import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.scss']
})
export class ShowDataComponent implements OnInit {
  @Input() data: Observable<Object[]>;
  public hobbyGroups: Array<Object> = [];
  constructor() { }

  ngOnInit(): void {
    this.data.subscribe((groups) => this.hobbyGroups = groups);
  }



}
