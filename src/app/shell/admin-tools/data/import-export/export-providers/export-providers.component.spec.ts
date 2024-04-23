import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ExportProvidersComponent } from './export-providers.component';

describe('ExportProvidersComponent', () => {
  let component: ExportProvidersComponent;
  let fixture: ComponentFixture<ExportProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportProvidersComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all providers', () => {
    expect(component.getAllProviders()).toBeTruthy();
  });
});
