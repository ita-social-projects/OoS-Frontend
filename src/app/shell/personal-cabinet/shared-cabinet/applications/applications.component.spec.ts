/* eslint-disable linebreak-style */
import { MatTabsModule } from '@angular/material/tabs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationsComponent } from './applications.component';
import { NgxsModule} from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationChildSortingPipe } from 'src/app/shared/pipes/application-child-sorting.pipe';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { TextSliceTransformPipe } from 'src/app/shared/pipes/text-slice-transform.pipe';
import { StatusInfoCardComponent } from '../../../../shared/components/status-info-card/status-info-card.component';
import { Application, ApplicationCards } from '../../../../shared/models/application.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { ApplicationChildFilterPipe } from '../../../../shared/pipes/application-child-filter.pipe';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
;

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
        TextSliceTransformPipe,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
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
  @Input() applicationCards: ApplicationCards;
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
