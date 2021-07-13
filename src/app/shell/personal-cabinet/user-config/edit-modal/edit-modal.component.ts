import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {

  authServer: string;
  link: SafeResourceUrl;

  constructor(@Inject(MAT_DIALOG_DATA) private data: string, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.authServer = environment.stsServer;
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(this.authServer + this.data);
  }

}
