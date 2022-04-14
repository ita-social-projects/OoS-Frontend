import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { CategoryIcons } from 'src/app/shared/enum/category-icons';
import { Role } from 'src/app/shared/enum/role';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { AppState } from 'src/app/shared/store/app.state';
import { takeUntil } from 'rxjs/operators';
import { imgPath } from 'src/app/shared/models/carousel.model';
import { Constants } from 'src/app/shared/constants/constants';
import { ImagesService } from 'src/app/shared/services/images/images.service';
import { Address } from 'src/app/shared/models/address.model';

@Component({
  selector: 'app-information-page',
  templateUrl: './information-page.component.html',
  styleUrls: ['./information-page.component.scss'],
})
export class InformationPageComponent implements OnInit, OnDestroy {
  readonly Role: typeof Role = Role;
  readonly categoryIcons = CategoryIcons;
  readonly constants: typeof Constants = Constants;

  @Input() role: string;
  @Input() workshop: Workshop;
  @Input() set providerData(provider: Provider) {
    this.address = provider.actualAddress
      ? provider.actualAddress :
      provider.legalAddress;
    this.setCoverImage();
    this.provider = provider;
  };

  provider: Provider;
  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: imgPath[] = [];
  address: Address;

  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private imagesService: ImagesService) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.selectedIndex = 0));
  }

  private setCoverImage(): void {
    const enityty = this.workshop ? this.workshop : this.provider;
    this.images = this.imagesService.setCarouselImages(enityty);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
