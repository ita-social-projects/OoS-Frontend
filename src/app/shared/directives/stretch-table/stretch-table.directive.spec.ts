import { ElementRef, Renderer2, ViewContainerRef } from '@angular/core';
import { StretchTableDirective } from './stretch-table.directive';

describe('StretchTableDirective', () => {
  let directive: StretchTableDirective;
  let element: HTMLElement;
  let mockRenderer: Renderer2;
  let mockViewContainerRef: ViewContainerRef;

  beforeEach(() => {
    const container = document.createElement('div');
    container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th class="mat-column-main">Main</th>
            <th>Content</th>
            <th class="mat-column-actions" style="position: sticky"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="mat-column-main">Main data</td>
            <td>Content data</td>
            <td class="mat-column-actions">Actions data</td>
          </tr>
        </tbody>
      </table>
    </div>
    `;

    document.body.appendChild(container);

    const ths = container.querySelectorAll('th');
    const tableContainer = container.getElementsByClassName('table-container')[0];

    Object.defineProperty(tableContainer, 'offsetWidth', { value: 250 });
    Object.defineProperty(ths[2], 'offsetWidth', { value: 100 });

    const mockComponentRef = {
      instance: {
        insertNode: jest.fn()
      },
      location: {
        nativeElement: document.createElement('div')
      }
    };

    mockViewContainerRef = {
      createComponent: jest.fn().mockReturnValue(mockComponentRef as any)
    } as unknown as ViewContainerRef;

    mockRenderer = {
      removeChild: jest.fn(),
      appendChild: jest.fn(),
      setStyle: jest.fn((el, style, value) => {
        el.style[style] = value;
      })
    } as unknown as Renderer2;

    element = container.querySelector('table');

    directive = new StretchTableDirective(document, new ElementRef(element), mockRenderer, mockViewContainerRef);
    directive.ngAfterViewInit();
    jest.spyOn(Math, 'abs').mockReturnValue(20);
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(element, 'visibility', 'hidden');
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add resize structure', () => {
    directive.addResizeStructure();
    expect(mockRenderer.removeChild).toHaveBeenCalledTimes(2);
    expect(mockViewContainerRef.createComponent).toHaveBeenCalledTimes(2);
    expect(mockRenderer.appendChild).toHaveBeenCalledTimes(2);
    expect(element.style.visibility).toBe('visible');
    expect(mockRenderer.setStyle).toHaveBeenCalledTimes(4);
    expect(directive.tableContainerWidth).toEqual(250);
  });

  it('should calculate maxWidth correctly', () => {
    directive.selectedTh = document.querySelector('th.mat-column-main') as HTMLElement;
    const maxWidth = directive.getMaxWidth();
    expect(maxWidth).toEqual(150);
  });
});
