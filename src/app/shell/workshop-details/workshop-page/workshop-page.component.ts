import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryIcons } from 'src/app/shared/enum/category-icons';
import { FeaturesList } from 'src/app/shared/models/featuresList.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-workshop-page',
  templateUrl: './workshop-page.component.html',
  styleUrls: ['./workshop-page.component.scss']
})
export class WorkshopPageComponent implements OnInit, OnDestroy {


  public categoryIcons = CategoryIcons;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() providerWorkshops: WorkshopCard[];
  @Input() role: string;

  @Select(MetaDataState.featuresList) featuresList$: Observable<FeaturesList>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  imgUrl = `https://api.oos.dmytrominochkin.cloud/api/v1/PublicImage/`;
  imgId: string;
  isRelease2: boolean;

  constructor() { }

  ngOnInit(): void {
    this.imgId = this.workshop.imageIds[0];
    this.featuresList$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((featuresList: FeaturesList) => this.isRelease2 = featuresList.release2);

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
