import { InfoBoxHostDirective } from './info-box-host.directive';
import { ViewContainerRef } from '@angular/core';

const elRefMock = { } as ViewContainerRef;

describe('InfoBoxHostDirective', () => {
  it('should create an instance', () => {
    const directive = new InfoBoxHostDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
