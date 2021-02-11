import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  options: Option[] = [
    {value: 'ratingDesc', viewValue: 'Рейтинг'},
    {value: 'ratingAsc', viewValue: 'Рейтинг'},
    {value: 'priceDesc', viewValue: 'Ціна'},
    {value: 'priceAsc', viewValue: 'Ціна'}
  ]
  selectedOption = this.options[0];
  visible: boolean = false;

  toggleOptions(){
    this.visible = !this.visible;
  }
  selectOption(id){
    this.selectedOption = this.options[id];
    this.toggleOptions();
  }
  @HostListener('document:click', ['$event'])
  onClick(event) {
      if (!event.target.closest('.ordering')) {
        this.visible = false;
      }
  }

}
