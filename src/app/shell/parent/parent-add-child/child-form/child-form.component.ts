import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ChildCard } from 'src/app/shared/models/child-card.model';
import { ChildCardComponent } from '../../parent-config/child-card/child-card.component';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss']
})
export class ChildFormComponent implements OnInit {
  

  child: ChildCard = new ChildCard() ;
  childFormGroup: FormGroup;
  

  constructor(private fb: FormBuilder, private http: HttpClient) { 
    this.childFormGroup = this.fb.group({
      lastName: new FormControl(''),
      firstName: new FormControl(''), 
      secondName: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    

    this.child= <ChildCard> this.childFormGroup.value;
    this.http.post('http://api.oos.dmytrominochkin.cloud/Child/Create', this.child)
    
  }

  show():void{
    let data= this.http.get<ChildCard[]>('/Child/Get');

  }
}
