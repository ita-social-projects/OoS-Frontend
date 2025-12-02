import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Competition } from 'shared/models/competition.model';

@Component({
  selector: 'app-competition-about',
  templateUrl: './competition-about.component.html',
  styleUrls: ['./competition-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionAboutComponent {
  @Input() public competition: Competition;
}
