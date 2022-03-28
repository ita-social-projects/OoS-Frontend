import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { NgxsModule, Store } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../shared/models/workshop.model';
import { User } from '../../shared/models/user.model';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { Provider } from 'src/app/shared/models/provider.model';
import { FlexLayoutModule } from '@angular/flex-layout';

const MockUser = {
  role: '',
};

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterModule.forRoot([]),
        FlexLayoutModule
      ],
      declarations: [
        DetailsComponent,
        MockSideMenuComponent,
        MockDetailsPageComponent
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue(MockUser as User);

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-details-page',
  template: ''
})
class MockDetailsPageComponent {
  @Input() workshop: Workshop;
  @Input() providerData: Provider;
  @Input() providerWorkshops: Workshop[];
  @Input() role: string;
}

@Component({
  selector: 'app-side-menu',
  template: ''
})
class MockSideMenuComponent {
  @Input() workshop: Workshop;
  @Input() role: string;
}
