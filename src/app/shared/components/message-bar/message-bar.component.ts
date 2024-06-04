import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA, MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { MessageBarIcon } from 'shared/enum/message-bar';
import { MessageBarData } from 'shared/models/message-bar.model';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {
  public messageIcon: MessageBarIcon = MessageBarIcon.success;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: MessageBarData
  ) {}

  public ngOnInit(): void {
    this.messageIcon = MessageBarIcon[this.data.type];
  }

  public onClose(): void {
    this.snackBar.dismiss();
  }
}
