import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { Workshop, WorkshopProviderViewCard } from 'shared/models/workshop.model';
import { ApplicationChildFilterPipe } from 'shared/pipes/application-child-filter.pipe';
import { ApplicationFilterPipe } from 'shared/pipes/application-filter.pipe';
import { Provider } from 'shared/models/provider.model';
import { Role } from 'shared/enum/role';
import { of } from 'rxjs';
import { ProviderWorkshopsComponent } from './provider-workshops.component';

describe('ProviderWorkshopsComponent', () => {
  let component: ProviderWorkshopsComponent;
  let fixture: ComponentFixture<ProviderWorkshopsComponent>;
  const mockData = {
    entities: [{ id: '1' } as WorkshopProviderViewCard, { id: '2' } as WorkshopProviderViewCard],
    totalAmount: 2
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([]), MatDialogModule, MatTabsModule, TranslateModule.forRoot()],
      declarations: [
        ProviderWorkshopsComponent,
        MockWorkshopCardComponent,
        ApplicationFilterPipe,
        ApplicationChildFilterPipe,
        NoResultCardComponent
      ]
    }).compileComponents();

    const store = TestBed.inject(Store);
    jest.spyOn(store, 'select').mockReturnValue(of(mockData));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderWorkshopsComponent);
    component = fixture.componentInstance;
    component.provider = { providerId: '1' } as unknown as Provider;
    component.role = Role.provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initProviderData correctly', () => {
    const getSpy = jest.spyOn(component as any, 'getProviderWorkshops');
    component.initProviderData();
    expect(getSpy).toHaveBeenCalled();
    expect(component.workshops).toEqual(mockData);
  });
});

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isCabinetView: boolean;
}
