import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { setMinAge, setMaxAge } from 'src/app/shared/store/filter.actions';

import { FilterStateModel } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  

  @Select() filter$: Observable<FilterStateModel>;

  unsubscribe$: Subject<void> = new Subject;
  showModalFilter: boolean = false;
  minAgeState: number = null;
  maxAgeState: number = null;

  constructor(private store: Store, private fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.myForm = this.fb.group({
      minAge: [null, [
        Validators.minLength(2),
        Validators.min(0),
        Validators.max(30)
      ]],
      maxAge: [null, [
        Validators.minLength(2),
        Validators.min(0),
        Validators.max(30)
      ]],
    })

    this.filter$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => { 
        this.minAgeState = res.ageFrom; 
        this.maxAgeState = res.ageTo
      }
    )
    
    this.minAge.valueChanges
    .pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged()
      )
    .subscribe(age => {
      this.setMinAge(age)
    })

    this.maxAge.valueChanges
    .pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged()
      )
    .subscribe(age => {
      this.setMaxAge(age)
    })

  }

  get minAge() {
    return this.myForm.get('minAge')
  }

  get maxAge() {
    return this.myForm.get('maxAge')
  }

  setMinAge(age: number){
    this.store.dispatch(new setMinAge(age))
  }
  setMaxAge(age: number){
    this.store.dispatch(new setMaxAge(age))
  }

  toggleModalFilter(): void{
    this.showModalFilter = !this.showModalFilter;
  }

  @HostListener('document:click', ['$event'])onClick(event) {
      if (!event.target.closest('.filter__age')) {
        this.showModalFilter = false;
      }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
