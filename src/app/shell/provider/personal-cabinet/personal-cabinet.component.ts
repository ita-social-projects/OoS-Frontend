import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})
export class PersonalCabinetComponent implements OnInit {

  
  id: string;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { 
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id'); 
    console.log(this.id )
  }

}
