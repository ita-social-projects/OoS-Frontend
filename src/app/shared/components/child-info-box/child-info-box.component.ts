import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Constants } from '../../constants/constants';
import { Gender } from '../../enum/gender';
import { Child } from '../../models/child.model';
import { SocialGroup } from '../../models/socialGroup.model';
import { ChildrenService } from '../../services/children/children.service';
import { DetectedDeviceService } from '../../services/detected-device.service';
import { Util } from '../../utils/utils';

@Component({
  selector: 'app-child-info-box',
  templateUrl: './child-info-box.component.html',
  styleUrls: ['./child-info-box.component.scss']
})
export class ChildInfoBoxComponent implements OnInit {

  constructor(private childrenService: ChildrenService, private detectedDevice: DetectedDeviceService) { }

  @Input() child: Child;
  isMobile = false
  socialGroup: SocialGroup;
  childAge: string;
  childFullName: string;
  parentFullName: string;
  parentPhoneNumber: string;
  parentEmail: string;

  readonly gender = Gender;
  readonly constants: typeof Constants = Constants;
  readonly phonePrefix = Constants.PHONE_PREFIX;



  ngOnInit(): void {
    if (this.socialGroup) {
      this.childrenService.getSocialGroupById(this.child.socialGroupId).subscribe(socialGroup => this.socialGroup = socialGroup);
    } else {
      this.socialGroup === null;
    }

    this.childAge = Util.getChildAge(this.child);
    this.isMobile = this.detectedDevice.checkedDevice();
    this.parentFullName = Util.getFullName(this.child.parent);
    this.childFullName = Util.getFullName(this.child);
    this.parentPhoneNumber = this.child.parent.phoneNumber;
    this.parentEmail = this.child.parent.email;
  }
}
