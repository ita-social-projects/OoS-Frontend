import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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

interface imgPath {
  path: string;
}
@Component({
  selector: 'app-workshop-page',
  templateUrl: './workshop-page.component.html',
  styleUrls: ['./workshop-page.component.scss']
})

export class WorkshopPageComponent implements OnInit, OnDestroy {
  
  readonly Role: typeof Role = Role;
  public categoryIcons = CategoryIcons;
  //@Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() providerWorkshops: WorkshopCard[];
  @Input() role: string;
  // @Input() set imageIds(imageIdsArr: string[]) {
  //   if (imageIdsArr.length) {
  //     console.log('ImageIdsArrLength = ', imageIdsArr.length)
  //     this.images = [];
  //     this.images = imageIdsArr.map((imgId) => { return { path: this.authServer + this.imgUrl + imgId } })
  //     console.log('Images Length = ', this.images.length)
  //   } else {
  //     console.log('ImageIdsArrLength = 0');
  //     this.images = [];
  //     this.images.push({ path: 'assets/images/groupimages/workshop-img.png' })
  //     console.log('Images Length = ', this.images.length)
  //   }
  // }
  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  authServer: string = environment.serverUrl;
  imgUrl = `/api/v1/PublicImage/`;
  images: imgPath[] = [];
  workshop: Workshop;

  constructor() { }

  ngOnInit(): void {
    this.workshop$.pipe(
      filter((workshop: Workshop) => !!workshop),
      takeUntil(this.destroy$)
    ).subscribe((workshop: Workshop) => {
      this.workshop = workshop;
      this.getWorkshopImages();
    })
  }

  private getWorkshopImages(): void {
    if (this.workshop?.imageIds.length) {
      this.images = this.workshop.imageIds.map((imgId) => { return { path: this.authServer + this.imgUrl + imgId } })
    } else {
      this.images = [];
      this.images.push({ path: 'assets/images/groupimages/workshop-img.png' })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
