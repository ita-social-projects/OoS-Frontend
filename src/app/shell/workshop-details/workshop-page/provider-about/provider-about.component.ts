import { Component, Input, OnInit, Provider } from '@angular/core';

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
