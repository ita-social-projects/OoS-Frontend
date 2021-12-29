import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CategoryIcons } from 'src/app/shared/enum/category-icons';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
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

  destroy$: Subject<boolean> = new Subject<boolean>();

  imgUrl = `https://api.oos.dmytrominochkin.cloud/api/v1/PublicImage/`;
  images: imgPath[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getWorkshopImages();
  }

  private getWorkshopImages(): void {
    if (this.workshop?.imageIds.length) {
      this.images = this.workshop.imageIds.map((imgId) => { return { path: this.imgUrl + imgId } })
    } else {
      this.images.push({ path: 'assets/images/groupimages/workshop-img.png' })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
