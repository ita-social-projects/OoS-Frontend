import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { StatusInfoCardComponent } from 'shared/components/status-info-card/status-info-card.component';
import { WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Application } from 'shared/models/application.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Workshop } from 'shared/models/workshop.model';
import { ApplicationChildFilterPipe } from 'shared/pipes/application-child-filter.pipe';
import { ApplicationChildSortingPipe } from 'shared/pipes/application-child-sorting.pipe';
import { TextSliceTransformPipe } from 'shared/pipes/text-slice-transform.pipe';
import { ApplicationsComponent } from './applications.component';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatTabsModule,
        MatDialogModule,
        MatMenuModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        ApplicationsComponent,
        MockApplicationCardComponent,
        ApplicationChildFilterPipe,
        ApplicationChildSortingPipe,
        MockWorkshopChekcboxDropdownComponent,
        StatusInfoCardComponent,
        NoResultCardComponent,
        MockApplicationCardPaginatorComponent,
        TextSliceTransformPipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    component.applicationParams = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-application-card',
  template: ''
})
class MockApplicationCardComponent {
  @Input() application: Application;
  @Input() userRole: string;
}

@Component({
  selector: 'app-entity-checkbox-dropdown',
  template: ''
})
class MockWorkshopChekcboxDropdownComponent {
  @Input() entities: Workshop[];
  @Input() declination: WorkshopDeclination;
}
@Component({
  selector: 'app-paginator',
  template: ''
})
class MockApplicationCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}
