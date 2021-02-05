import { Component, OnInit } from '@angular/core'
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
 
  constructor() { }
  searchValue = new FormControl('');
  isInvalid = false;
  errorText = 'Error';
  placeHolder: string = 'Введіть назву або тип гуртка'
  boolData: boolean = false;

  ngOnInit(): void {
   
  }
  onInput(): void {
    this.isInvalid = false;
    const allowedChars = ['й','ц','у','к','е','н','г','ш','щ','з','х','ї','ф','і','в','а','п','р','о','л','д','ж','є','ґ','я','ч','с','м','и','т','ь','б','ю',' '];
    if(this.searchValue.value.length > 200){
      this.isInvalid = true;
      return;
    }
    for(let i = 0; i < this.searchValue.value.length; i++){
      if(!allowedChars.includes(this.searchValue.value[i].toLowerCase())){
        this.errorText = 'Пошук не може містити спеціальні символи.';
        this.isInvalid = true;
        return;
      }
    }
  }
  
  checkPlaceHolder() {
    if (this.placeHolder) {
      this.placeHolder = null
      return;
    } else {
      this.placeHolder = 'Введіть назву або тип гуртка'
      
      return
    }
  }

}
