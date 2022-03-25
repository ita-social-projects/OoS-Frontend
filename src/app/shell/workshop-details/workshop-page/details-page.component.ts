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
import { UserState } from 'src/app/shared/store/user.state';
import { filter, takeUntil } from 'rxjs/operators';
import { imgPath } from 'src/app/shared/models/carousel.model';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
})
export class DetailsPageComponent implements OnInit, OnDestroy {
  readonly Role: typeof Role = Role;

  @Input() provider: Provider;
  @Input() data: Workshop | Provider;
  @Input() providerWorkshops: WorkshopCard[];
  @Input() role: string;

  categoryIcons = CategoryIcons;
  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: imgPath[] = [];

  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.workshop$.pipe(
      filter((workshop: Workshop) => !!workshop),
      takeUntil(this.destroy$)
    ).subscribe((workshop: Workshop) => {
      this.workshop = workshop;
      this.getWorkshopImages();
    })
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.selectedIndex = 0));
  }

  private getWorkshopImages(): void {
    if (this.workshop?.imageIds.length) {
      this.images = this.workshop.imageIds.map((imgId) => {
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
