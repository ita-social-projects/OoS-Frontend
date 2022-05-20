import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Select } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';

@Component({
  selector: 'app-platform-info',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.scss']
})
export class PlatformInfoComponent implements OnInit{
  @Select(AdminState.platformInfo)
  platformInfo$: Observable<CompanyInformation>;
  platformInfo: CompanyInformation;

  constructor() { }
  ngOnInit(): void {
  }
}
