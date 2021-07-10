import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { messageType } from '../../enum/messageBar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  messageType: string = messageType['success'];

  constructor(private snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
    this.messageType = messageType[this.data.type];
  }

  onClose(): void {
    this.snackBar.dismiss();
  }

}
