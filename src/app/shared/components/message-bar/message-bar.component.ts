import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

import { messageType } from 'shared/enum/message-bar';
import { MessageBar } from 'shared/models/message-bar.model';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {
  public messageType: string = messageType[messageType.success];

  constructor(private snackBar: MatSnackBar, @Inject(MAT_SNACK_BAR_DATA) public data: MessageBar) {}

  public ngOnInit(): void {
    this.messageType = messageType[this.data.type];
  }

  public onClose(): void {
    this.snackBar.dismiss();
  }
}
