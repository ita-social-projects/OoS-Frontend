import { OwlOptions } from 'ngx-owl-carousel-o';

export const DefaultCarouselOptions: OwlOptions = {
  loop: true,
  autoplay: true,
  dots: true,
  nav: true,
  navText: ['<span class="material-icons">arrow_back_ios</span>', '<span class="material-icons">arrow_forward_ios</span>'],
  responsive: {
    0: {
      items: 1
    }
  }
};
