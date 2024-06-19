import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';
import { TranslateModule } from '@ngx-translate/core';
import { ExportProvidersComponent } from './export-providers.component';

describe('ExportProvidersComponent', () => {
  let component: ExportProvidersComponent;
  let fixture: ComponentFixture<ExportProvidersComponent>;
  let adminImportExportServiceMock: jest.Mocked<AdminImportExportService>;

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
    adminImportExportServiceMock = TestBed.inject(AdminImportExportService) as jest.Mocked<AdminImportExportService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllProviders and download the file', (done) => {
    const mockResponse = new Blob(['test data'], { type: 'text/csv' });
    jest.spyOn(adminImportExportServiceMock, 'getAllProviders').mockReturnValue(of(mockResponse));
    const createObjectURLMock = jest.fn();
    createObjectURLMock.mockReturnValue('blobUrl');
    globalThis.URL.createObjectURL = createObjectURLMock;
    const revokeObjectURLMock = jest.fn();
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;
    const anchorElementMock = {
      click: jest.fn(),
      href: '',
      download: '',
      setAttribute: jest.fn()
    } as unknown as HTMLAnchorElement;
    const createElementMock = jest.spyOn(document, 'createElement').mockReturnValue(anchorElementMock);
    const appendChildMock = jest.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => node);
    const removeChildMock = jest.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => node);
    component.getAllProviders();
    adminImportExportServiceMock.getAllProviders().subscribe(() => {
      expect(adminImportExportServiceMock.getAllProviders).toHaveBeenCalled();
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(createElementMock).toHaveBeenCalledWith('a');
      expect(anchorElementMock.href).toBe('blobUrl');
      expect(anchorElementMock.download).toBe('Список надавачів.csv');
      expect(appendChildMock).toHaveBeenCalledWith(anchorElementMock);
      expect(anchorElementMock.click).toHaveBeenCalled();
      expect(removeChildMock).toHaveBeenCalledWith(anchorElementMock);
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blobUrl');
      jest.restoreAllMocks();
      done();
    });
  });
});
