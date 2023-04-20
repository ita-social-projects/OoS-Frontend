import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Constants } from '../../../../../shared/constants/constants';
import { Teacher } from '../../../../../shared/models/teacher.model';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-teacher-card',
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss']
})
export class TeacherCardComponent implements OnInit {
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;

  @Input() teacher: Teacher;

  teacherFullName: string;
  coverImageUrl: string;

  constructor() {}

  ngOnInit(): void {
    this.teacherFullName = Util.getFullName(this.teacher);
    this.getCoverImageUrl();
  }

  private getCoverImageUrl(): void {
    this.coverImageUrl = this.teacher.coverImageId ? environment.storageUrl + this.teacher.coverImageId : 'assets/icons/teacher.png';
  }
}
