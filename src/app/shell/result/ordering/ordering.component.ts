import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Option } from '../result.component';

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent {

  @Input() options: Option[];
  @Input() selectedOption: Option;
  @Output() onChange = new EventEmitter<string>();
  visible: boolean = false;

  toggleOptions(){
    this.visible = !this.visible;
  }

  selectOrder(id: number){
    this.onChange.emit(this.options[id].value);
    this.toggleOptions();
  }

  @HostListener('document:click', ['$event']) onClick(event) {
    if(!event.target.closest('.ordering-button')) {
      this.visible = false;
    }
  }
}
