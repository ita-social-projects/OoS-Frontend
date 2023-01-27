import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { ProviderListComponent } from './provider-list.component';
import { ReasonModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ProviderListComponent', () => {
  let component: ProviderListComponent;
  let fixture: ComponentFixture<ProviderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        RouterTestingModule,
        MatMenuModule,
        MatIconModule,
        MatFormFieldModule,
        NgxsModule.forRoot([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      declarations: [ProviderListComponent, MockproviderInfoComponent, MockListAdminProviderPaginatorComponent, ReasonModalWindowComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-provider-info',
  template: ''
})
class MockproviderInfoComponent {
  @Input() provider: Provider;
  @Input() isProviderView: boolean;
}

@Component({
  selector: 'app-paginator',
  template: ''
})
class MockListAdminProviderPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}
