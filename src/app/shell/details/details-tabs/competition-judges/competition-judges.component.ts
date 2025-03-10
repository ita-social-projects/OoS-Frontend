import { Component, Input } from '@angular/core';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Judge } from 'shared/models/judge.model';

@Component({
  selector: 'app-competition-judges',
  templateUrl: './competition-judges.component.html',
  styleUrls: ['./competition-judges.component.scss']
})
export class CompetitionJudgesComponent {
  @Input() public judges: Judge[];

  public readonly noResultJudges = NoResultsTitle.noJudges;
}
