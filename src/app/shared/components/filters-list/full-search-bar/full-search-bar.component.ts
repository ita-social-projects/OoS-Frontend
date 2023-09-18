import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-search-bar',
  templateUrl: './full-search-bar.component.html',
  styleUrls: ['./full-search-bar.component.scss']
})
export class FullSearchBarComponent {
  @Input() public styleClass: string;
}
