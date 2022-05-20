import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { Select, Store } from '@ngxs/store';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-platform-info',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.scss']
})
export class PlatformInfoComponent implements OnInit, OnDestroy {
  @Select(AdminState.platformInfo)
  platformInfo$: Observable<CompanyInformation>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  type: PlatformInfoType;

  constructor( 
    private route: ActivatedRoute,
    private store: Store ) { }
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.type = PlatformInfoType[params.index];
        if(this.type){
          this.store.dispatch(new GetPlatformInfo(this.type)); //TODO: clarify if the performance is ok
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
