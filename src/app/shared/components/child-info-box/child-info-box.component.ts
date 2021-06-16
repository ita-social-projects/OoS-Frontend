import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Child } from '../../models/child.model';
import { SocialGroup } from '../../models/socialGroup.model';
import { ChildrenService } from '../../services/children/children.service';

@Component({
  selector: 'app-child-info-box',
  templateUrl: './child-info-box.component.html',
  styleUrls: ['./child-info-box.component.scss']
})
export class ChildInfoBoxComponent implements OnInit {

  constructor(private childrenService: ChildrenService) { }

  @Input() child: Child;
  socialGroup: SocialGroup;
  @ViewChild('childInfoBox') childInfoBox: ElementRef<HTMLInputElement>;
  @Input() top: string;
  @Input() left: string;

  ngOnInit(): void {
    this.childrenService.getSocialGroupById(this.child.socialGroupId).subscribe(socialGroup => this.socialGroup = socialGroup);
  }
}
