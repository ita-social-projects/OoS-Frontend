import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';
import { TranslateModule } from '@ngx-translate/core';
import { ExportProvidersComponent } from './export-providers.component';

describe('ExportProvidersComponent', () => {
  let component: ExportProvidersComponent;
  let fixture: ComponentFixture<ExportProvidersComponent>;
  let adminImportExportService: jest.Mocked<AdminImportExportService>;

  beforeEach(async () => {
    const spy = {
      getAllProviders: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ExportProvidersComponent],
      providers: [{ provide: AdminImportExportService, useValue: spy }],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportProvidersComponent);
    component = fixture.componentInstance;
    adminImportExportService = TestBed.inject(AdminImportExportService) as jest.Mocked<AdminImportExportService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getAllProviders and download the file', (done) => {
    // Arrange
    const mockResponse = new Blob(['test data'], { type: 'text/csv' });
    adminImportExportService.getAllProviders.mockReturnValue(of(mockResponse));

    // Mock createObjectURL
    const createObjectURLMock = jest.fn();
    createObjectURLMock.mockReturnValue('blobUrl');
    globalThis.URL.createObjectURL = createObjectURLMock;

    // Simulate createElement behavior
    const createElementMock = jest.spyOn(document, 'createElement').mockReturnValue({
      click: jest.fn(),
      setAttribute: jest.fn()
    } as unknown as HTMLAnchorElement);

    // Act
    component.getAllProviders();

    // Assert
    adminImportExportService.getAllProviders().subscribe(() => {
      expect(adminImportExportService.getAllProviders).toHaveBeenCalled();
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(createElementMock).toHaveBeenCalledWith('a');

      const anchorElement = createElementMock.mock.results[0].value;
      expect(anchorElement.click).toHaveBeenCalled();

      // Clean up
      done();
    });
  });
});
