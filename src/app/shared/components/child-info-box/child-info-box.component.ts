import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Child } from '../../models/child.model';

@Component({
  selector: 'app-child-info-box',
  templateUrl: './child-info-box.component.html',
  styleUrls: ['./child-info-box.component.scss']
})
export class ChildInfoBoxComponent implements OnInit {

  constructor() { }

  @Input() child: Child;
  @ViewChild('childInfoBox') childInfoBox: ElementRef<HTMLInputElement>;
  @Input() top: string;
  @Input() left: string;

  ngOnInit(): void {
  }
}
