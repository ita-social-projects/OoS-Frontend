import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-stretch-cell',
  templateUrl: './stretch-cell.component.html',
  styleUrls: ['./stretch-cell.component.scss']
})
export class StretchCellComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
  }

  public insertNode(node: any){
    this.renderer.appendChild(this.el.nativeElement.childNodes[0], node);

    this.cdr.detectChanges();
  }
}
