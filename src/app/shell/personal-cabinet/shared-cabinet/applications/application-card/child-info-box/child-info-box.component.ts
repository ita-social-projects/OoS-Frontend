import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../../../../../shared/constants/constants';
import { Gender } from '../../../../../../shared/enum/gender';
import { Child } from '../../../../../../shared/models/child.model';
import { DetectedDeviceService } from '../../../../../../shared/services/detected-device.service';
import { Util } from '../../../../../../shared/utils/utils';

@Component({
  selector: 'app-child-info-box',
  templateUrl: './child-info-box.component.html',
  styleUrls: ['./child-info-box.component.scss']
})
export class ChildInfoBoxComponent implements OnInit {
  readonly gender = Gender;
  readonly constants: typeof Constants = Constants;
  readonly phonePrefix = Constants.PHONE_PREFIX;

  constructor(private detectedDevice: DetectedDeviceService) { }

  @Input() child: Child;
  
  isMobile = false
  childAge: string;
  childFullName: string;
  parentFullName: string;
  parentPhoneNumber: string;
  parentEmail: string;

  ngOnInit(): void {
    this.childAge = Util.getChildAge(this.child);
    this.isMobile = this.detectedDevice.checkedDevice();
    this.parentFullName = Util.getFullName(this.child.parent);
    this.childFullName = Util.getFullName(this.child);
    this.parentPhoneNumber = this.child.parent.phoneNumber;
    this.parentEmail = this.child.parent.email;
  }
}
