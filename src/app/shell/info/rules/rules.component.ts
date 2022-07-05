import { Component, OnInit } from '@angular/core';

import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnInit {
  platformRules: CompanyInformation;
  constructor(private platformService: PlatformService) {}
  ngOnInit(): void {
    this.platformService
      .getPlatformInfo(PlatformInfoType.LawsAndRegulations)
      .toPromise()
      .then(
        (result: CompanyInformation) => (this.platformRules = result)
      );
  }
}
