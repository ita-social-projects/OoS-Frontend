import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { messageType } from '../../enum/messageBar';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {

  messageType: string = messageType[messageType.success];

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.messageType = messageType[this.data.type];
  }

  onClose(): void {
    this.snackBar.dismiss();
  }

}
