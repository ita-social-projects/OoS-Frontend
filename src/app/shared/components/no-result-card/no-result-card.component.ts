import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-result-card',
  template: `
    <div class="empty-list-wrapper">
      <p class="text">{{ title | translate }}</p>
    </div>
  `,
  styleUrls: ['../../styles/components/list-wrappers.scss']
})
export class NoResultCardComponent {
  @Input() public title: string;
}
