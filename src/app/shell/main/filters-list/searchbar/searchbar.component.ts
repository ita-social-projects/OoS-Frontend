import { Component, OnInit } from '@angular/core'
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
 
  constructor() { }
  searchValue = new FormControl('', [Validators.maxLength(200), this.searchValidator]);
 

  ngOnInit(): void {
  }
  searchValidator(control: FormControl) : object | null  { 
    let value = control.value;
    if(value && !/^[а-яА-ЯІі\- a-zA-Z\s ]*$/.test(value)){
      return {
        isInvalid: true
      }
    }
    return null;
  }
  

}
