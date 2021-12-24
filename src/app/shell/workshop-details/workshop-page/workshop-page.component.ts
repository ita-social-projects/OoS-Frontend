import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryIcons } from 'src/app/shared/enum/category-icons';
import { FeaturesList } from 'src/app/shared/models/featuresList.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
interface imgPath {
  path: string;
}
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
  isRelease2: boolean;
  images: imgPath[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getWorkshopImages();
    this.featuresList$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((featuresList: FeaturesList) => this.isRelease2 = featuresList.release2);

  }

  getWorkshopImages(): void {
    if (this.workshop.imageIds.length) {
      this.workshop.imageIds.forEach((imgId) => this.images.push({ path: this.imgUrl + imgId }))
    } else {
      this.images.push({ path: 'assets/images/groupimages/workshop-img.png' })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
