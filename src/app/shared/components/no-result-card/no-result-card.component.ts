import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result-card',
  template: `
    <div class="empty-list-wrapper">
      <p class="text">{{title}}</p>
    </div>
  `,
  styleUrls: ['/src/app/shared/styles/list-wrappers.scss']
})
export class NoResultCardComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
