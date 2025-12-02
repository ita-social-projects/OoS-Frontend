import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '../models/application.model';
import { Child } from '../models/child.model';

@Pipe({
  name: 'applicationChildSorting'
})
export class ApplicationChildSortingPipe implements PipeTransform {
  public transform(children: Child[], applications: Application[]): Child[] {
    const calculateQuantity = (childId: string, array: Application[]): number => array.filter((item) => item.childId === childId).length;
    const sortFn = (a: Child, b: Child): number => calculateQuantity(b.id, applications) - calculateQuantity(a.id, applications);
    return children.slice().sort(sortFn);
  }
}
