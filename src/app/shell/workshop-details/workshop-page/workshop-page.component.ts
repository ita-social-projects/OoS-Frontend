import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryIcons } from 'src/app/shared/enum/category-icons';
import { Role } from 'src/app/shared/enum/role';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { AppState } from 'src/app/shared/store/app.state';
import { environment } from 'src/environments/environment';
interface imgPath {
  path: string;
}
@Component({
  selector: 'app-workshop-page',
  templateUrl: './workshop-page.component.html',
  styleUrls: ['./workshop-page.component.scss'],
})
export class WorkshopPageComponent implements OnInit, OnDestroy {
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() providerWorkshops: WorkshopCard[];
  @Input() role: string;
  readonly Role: typeof Role = Role;
  public categoryIcons = CategoryIcons;
  tabIndex: number;

  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  authServer: string = environment.serverUrl;
  imgUrl = `/api/v1/PublicImage/`;
  images: imgPath[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getWorkshopImages();
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.tabIndex = 0));
  }

  private getWorkshopImages(): void {
    if (this.workshop?.imageIds.length) {
      this.images = this.workshop.imageIds.map((imgId) => {
        return { path: this.authServer + this.imgUrl + imgId };
      });
    } else {
      this.images.push({ path: 'assets/images/groupimages/workshop-img.png' });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
