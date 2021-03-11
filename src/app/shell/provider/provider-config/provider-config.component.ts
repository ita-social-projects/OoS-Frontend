import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-provider-config',
  templateUrl: './provider-config.component.html',
  styleUrls: ['./provider-config.component.scss']
})
export class ProviderConfigComponent implements OnInit {
  providerForm = new FormGroup({
    organizationType: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    mobilePhone: new FormControl('+380', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    webSite: new FormControl(''),
    faceBook: new FormControl(''),
    instagram: new FormControl(''),
    description: new FormControl(''),
    address: new FormGroup({
      city: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      building: new FormControl('', Validators.required),
    }),
    edrpou: new FormControl('', Validators.required),
    user: new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }),
    dataProcessingPermission: new FormControl('', Validators.required),
    robotCheck: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    // this.http.post('http://localhost:5000/Organization/CreateOrganization', this.data)
    //   .subscribe(value => console.log(value));
  }

  onSubmit(): void {
    console.log(this.providerForm);
  }
}
