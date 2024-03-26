import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProvidersComponent } from './import-providers.component';

describe('ImportProvidersComponent', () => {
  let component: ImportProvidersComponent;
  let fixture: ComponentFixture<ImportProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportProvidersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
