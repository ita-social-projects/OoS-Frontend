import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
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
  styleUrls: ['./workshop-page.component.scss']
})

export class WorkshopPageComponent implements OnInit, OnDestroy, OnChanges {
  readonly Role: typeof Role = Role;
  public categoryIcons = CategoryIcons;
  tabIndex: number;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() providerWorkshops: WorkshopCard[];
  @Input() role: string;

  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  authServer: string = environment.serverUrl;
  imgUrl = `/api/v1/PublicImage/`;
  images: imgPath[] = [];

  constructor(private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.getWorkshopImages();
    this.tabIndex = 0;
    this.route.params.subscribe((params: Params) =>console.log(params))

  }
  ngOnChanges(change: any): void {
    this.tabIndex = 0;
    debugger
  }

  private getWorkshopImages(): void {
    if (this.workshop?.imageIds.length) {
      this.images = this.workshop.imageIds.map((imgId) => { return { path: this.authServer + this.imgUrl + imgId } })
    } else {
      this.images.push({ path: 'assets/images/groupimages/workshop-img.png' })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
