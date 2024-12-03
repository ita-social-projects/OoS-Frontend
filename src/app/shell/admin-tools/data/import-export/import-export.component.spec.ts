import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ImportExportComponent } from './import-export.component';

describe('ImportExportComponent', () => {
  let component: ImportExportComponent;
  let fixture: ComponentFixture<ImportExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportExportComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
