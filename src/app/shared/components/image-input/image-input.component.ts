import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent implements OnInit {
  uploadData;
  
  constructor() { 
    
  }

  ngOnInit(): void {
  }

   upload(event):void{
    console.log(event.target.files)
   }

}
