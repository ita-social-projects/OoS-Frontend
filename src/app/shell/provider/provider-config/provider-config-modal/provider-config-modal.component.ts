import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-provider-config-modal',
  templateUrl: './provider-config-modal.component.html',
  styleUrls: ['./provider-config-modal.component.scss']
})
export class ProviderConfigModalComponent {
  constructor(private dialogRef: MatDialogRef<ProviderConfigModalComponent>) {
  }

  closeModal(value: boolean): void {
    this.dialogRef.close(value);
  }
}

