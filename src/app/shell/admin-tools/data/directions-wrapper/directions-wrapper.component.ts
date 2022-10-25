import { Component, OnInit } from '@angular/core';
import { MainInstitutionTitles, MainInstitutionDisplayColumns } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-directions-wrapper',
  templateUrl: './directions-wrapper.component.html',
  styleUrls: ['./directions-wrapper.component.scss']
})
export class DirectionsWrapperComponent implements OnInit {
  readonly mainInstitutionTitles = MainInstitutionTitles;
  readonly mainInstitutionDisplayColumns = MainInstitutionDisplayColumns;
  constructor() { }

  ngOnInit(): void {
  }

}
