import { Component, Input, OnInit } from '@angular/core';
import { ImgPath } from 'shared/models/carousel.model';
import { ImagesService } from 'shared/services/images/images.service';
import { OwnershipTypesEnum, InstitutionTypesEnum } from '../../../../shared/enum/enumUA/provider';
import { Provider } from '../../../../shared/models/provider.model';

@Component({
  selector: 'app-provider-about',
  templateUrl: './provider-about.component.html',
  styleUrls: ['./provider-about.component.scss']
})
export class ProviderAboutComponent implements OnInit {
  @Input() public provider: Provider;

  public readonly ownershipTypesEnum = OwnershipTypesEnum;
  public readonly institutionTypesEnum = InstitutionTypesEnum;
  public images: ImgPath[];

  constructor(private readonly imagesService: ImagesService) {}

  public ngOnInit(): void {
    this.images = this.imagesService.getCarouselImages(Object.setPrototypeOf(this.provider, Provider.prototype));
  }
}
