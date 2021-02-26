import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-parent-config',
  templateUrl: './parent-config.component.html',
  styleUrls: ['./parent-config.component.scss']
})
export class ParentConfigComponent implements OnInit {
  form: FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm():void{
    this.form = this.fb.group({
       surname:'',
       name:"",
       lastName:"",
       phoneNumber:""
    });
  }
}
