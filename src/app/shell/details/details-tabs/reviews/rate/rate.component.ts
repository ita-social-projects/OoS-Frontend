import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rate } from '../../../../../shared/models/rating';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent {
  @Input() rate: Rate;
  @Output() deleteRate = new EventEmitter<Rate>();

  constructor() {}

  public onDelete(): void {
    this.deleteRate.emit(this.rate);
  }
}
