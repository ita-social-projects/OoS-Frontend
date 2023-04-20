import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result-card',
  template: `
    <div class="empty-list-wrapper">
      <p class="text">{{ title | translate }}</p>
    </div>
  `,
  styleUrls: ['../../styles/list-wrappers.scss']
})
export class NoResultCardComponent {
  @Input() title: string;
}
