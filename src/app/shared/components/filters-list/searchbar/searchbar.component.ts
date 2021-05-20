import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { SetSearchQueryValue } from 'src/app/shared/store/filter.actions';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  constructor(private store: Store) { }
  searchValue = new FormControl('', [Validators.maxLength(200), this.searchValidator]);
  destroy$: Subject<boolean> = new Subject<boolean>();


  ngOnInit(): void {
    this.searchValue.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      ).subscribe(val => {
        this.store.dispatch(new SetSearchQueryValue(val || ''));
      })
  }

  searchValidator(control: FormControl): object | null {
    let value = control.value;
    if (value && !/^[а-яА-ЯІі\- a-zA-Z\s ]*$/.test(value)) {
      return {
        isInvalid: true
      }
    }
    return null;
  }
}
