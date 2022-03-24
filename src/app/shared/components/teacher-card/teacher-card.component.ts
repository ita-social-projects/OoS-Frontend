import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from '../../constants/constants';
import { Teacher } from '../../models/teacher.model';

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

  constructor() {
  }

  ngOnInit(): void {
    this.teacherFullName = `${this.teacher.lastName} ${this.teacher.firstName}`;
    this.getCoverImageUrl();
  }

  private getCoverImageUrl(): void {
    if (this.teacher.avatarImageId) {
      this.coverImageUrl = environment.serverUrl + Constants.IMG_URL + this.teacher.avatarImageId;
    } else {
      this.coverImageUrl = 'assets/icons/teacher.png';
    }
  }

}
