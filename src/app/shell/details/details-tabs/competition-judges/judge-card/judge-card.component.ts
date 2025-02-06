import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'shared/constants/constants';
import { Judge } from 'shared/models/judge.model';
import { Util } from 'shared/utils/utils';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-judge-card',
  templateUrl: './judge-card.component.html',
  styleUrls: ['./judge-card.component.scss']
})
export class JudgeCardComponent implements OnInit {
  @Input()
  public judge: Judge;

  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;

  public judgeFullName: string;
  public coverImageUrl: string;

  public ngOnInit(): void {
    this.judgeFullName = Util.getFullName(this.judge);
    this.getCoverImageUrl();
  }

  private getCoverImageUrl(): void {
    this.coverImageUrl = this.judge.coverImageId ? environment.storageUrl + this.judge.coverImageId : 'assets/icons/judge.png';
  }
}
