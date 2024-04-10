import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProvidersComponent } from './export-providers.component';

describe('ExportProvidersComponent', () => {
  let component: ExportProvidersComponent;
  let fixture: ComponentFixture<ExportProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportProvidersComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(ExportProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all providers', () => {});
});
