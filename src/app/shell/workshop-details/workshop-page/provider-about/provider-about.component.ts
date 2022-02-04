import { Component, Input, OnInit } from '@angular/core';
import { Provider } from 'src/app/shared/models/provider.model';

@Component({
  selector: 'app-provider-about',
  templateUrl: './provider-about.component.html',
  styleUrls: ['./provider-about.component.scss']
})
export class ProviderAboutComponent implements OnInit {

  @Input() provider: Provider;

  constructor() { }

  ngOnInit(): void {
  }

}
