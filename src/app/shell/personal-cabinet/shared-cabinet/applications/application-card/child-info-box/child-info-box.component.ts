import { Component, Input, OnInit } from '@angular/core';

import { Constants } from 'shared/constants/constants';
import { YearDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Gender } from 'shared/enum/enumUA/gender';
import { Child } from 'shared/models/child.model';
import { DetectedDeviceService } from 'shared/services/detected-device/detected-device.service';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-child-info-box',
  templateUrl: './child-info-box.component.html',
  styleUrls: ['./child-info-box.component.scss']
})
export class ChildInfoBoxComponent implements OnInit {
  @Input() public child: Child;

  public readonly gender = Gender;
  public readonly constants: typeof Constants = Constants;
  public readonly YearDeclination = YearDeclination;

  public isMobile = false;
  public childFullName: string;
  public parentFullName: string;
  public parentPhoneNumber: string;
  public parentEmail: string;

  constructor(private detectedDevice: DetectedDeviceService) {}

  public get childAge(): number {
    return Util.getChildAge(this.child);
  }

  public ngOnInit(): void {
    this.isMobile = this.detectedDevice.checkedDevice();
    this.parentFullName = Util.getFullName(this.child.parent);
    this.childFullName = Util.getFullName(this.child);
    this.parentPhoneNumber = this.child.parent.phoneNumber;
    this.parentEmail = this.child.parent.email;
  }
}
