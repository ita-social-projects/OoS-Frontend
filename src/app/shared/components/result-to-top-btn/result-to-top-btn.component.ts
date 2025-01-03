import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result-to-top-btn',
  templateUrl: './result-to-top-btn.component.html',
  styleUrls: ['./result-to-top-btn.component.scss']
})
export class ResultToTopBtnComponent {
  @Input() public results: number;

  public scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
