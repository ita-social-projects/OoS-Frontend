import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { CategoryIcons } from 'src/app/shared/enum/category-icons';
import { Role } from 'src/app/shared/enum/role';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { AppState } from 'src/app/shared/store/app.state';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { imgPath } from 'src/app/shared/models/carousel.model';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
})
export class DetailsPageComponent implements OnInit, OnDestroy {
  readonly Role: typeof Role = Role;
  readonly categoryIcons = CategoryIcons;
  readonly constants: typeof Constants = Constants;

  @Input() providerWorkshops: WorkshopCard[];
  @Input() role: string;
  @Input() workshop: Workshop;
  @Input() set providerData(provider: Provider) {
    this.provider = provider;
    this.setCarouselImages();
  };

  provider: Provider;
  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: imgPath[] = [];

  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.selectedIndex = 0));
    this.setCarouselImages();
  }

  private setCarouselImages(): void {
    const enityty = this.workshop ? this.workshop : this.provider;
    if (enityty.imageIds?.length) {
      this.images = enityty.imageIds.map((imgId: string) => {
        return { path: environment.serverUrl + Constants.IMG_URL + imgId };
      });
    } else {
      this.images = [{ path: 'assets/images/groupimages/workshop-img.png' }];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
