import { FormOfLearning, WorkshopOpenStatus } from 'shared/enum/workshop';
import { Codeficator } from 'shared/models/codeficator.model';
import { Coords } from 'shared/models/coords.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';

export class SetCity {
  static readonly type = '[app] Set City';
  constructor(
    public payload: Codeficator,
    public isConfirmedCity: boolean
  ) {}
}

export class CleanCity {
  static readonly type = '[app] Clean City';
  constructor() {}
}

export class ConfirmCity {
  static readonly type = '[app] Confirm Current settlement';
  constructor(public payload: boolean) {}
}

export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) {}
}

export class SetDirections {
  static readonly type = '[filter] Set Direction';
  constructor(public payload: number[]) {}
}

export class SetWorkingDays {
  static readonly type = '[filter] Set Working Days';
  constructor(public payload: string[]) {}
}

export class SetStartTime {
  static readonly type = '[filter] Set Start Time';
  constructor(public payload: string) {}
}

export class SetEndTime {
  static readonly type = '[filter] Set End Time';
  constructor(public payload: string) {}
}

export class SetFormsOfLearning {
  static readonly type = '[filter] Set Forms Of Learning';
  constructor(public payload: FormOfLearning[]) {}
}

export class SetIsFree {
  static readonly type = '[filter] Set Is Free type of payment';
  constructor(public payload: boolean) {}
}

export class SetIsPaid {
  static readonly type = '[filter] Set Is Paid type of payment';
  constructor(public payload: boolean) {}
}

export class SetMinPrice {
  static readonly type = '[filter] Set Min Price';
  constructor(public payload: number) {}
}

export class SetMaxPrice {
  static readonly type = '[filter] Set Max Price';
  constructor(public payload: number) {}
}

export class SetSearchQueryValue {
  static readonly type = '[filter] Set Search Query Value';
  constructor(public payload: string) {}
}

export class AddPreviousResult {
  static readonly type = '[Search] Add Previous Result';
  constructor(public result: string) {}
}

export class RemovePreviousResult {
  static readonly type = '[Search] Remove Previous Result';
  constructor(public previousResult: string) {}
}

export class SetOpenRecruitment {
  static readonly type = '[filter] Set Open Recruitment';
  constructor(public payload: WorkshopOpenStatus[]) {}
}

export class SetClosedRecruitment {
  static readonly type = '[filter] Set Closed Recruitment';
  constructor(public payload: WorkshopOpenStatus[]) {}
}

export class GetFilteredWorkshops {
  static readonly type = '[filter] Get Filtered Workshops';
  constructor(public payload?: boolean) {}
}

export class SetWithDisabilityOption {
  static readonly type = '[filter] Set with Disability option';
  constructor(public payload: boolean) {}
}

export class SetIsStrictWorkdays {
  static readonly type = '[filter] Set with Strict workdays';
  constructor(public payload: boolean) {}
}

export class SetIsAppropriateHours {
  static readonly type = '[filter] Set with Strict hours';
  constructor(public payload: boolean) {}
}

export class SetFilterPagination {
  static readonly type = '[filter] Set Filter Pagination';
  constructor(public paginationParameters: PaginationParameters) {}
}

export class FilterChange {
  static readonly type = '[app] Filter Change';
  constructor() {}
}

export class FilterReset {
  static readonly type = '[filter] Filter Reset';
  constructor() {}
}

export class ResetFilteredWorkshops {
  static readonly type = '[filter] reset filtered workshops';
  constructor() {}
}

export class FilterClear {
  static readonly type = '[filter] Filter Clear';
  constructor() {}
}

export class SetMinAge {
  static readonly type = '[filter] Set Min Age';
  constructor(public payload: number) {}
}

export class SetMaxAge {
  static readonly type = '[filter] Set Max Age';
  constructor(public payload: number) {}
}

export class SetIsAppropriateAge {
  static readonly type = '[filter] Set with Strict age';
  constructor(public payload: boolean) {}
}

export class SetCoordsByMap {
  static readonly type = '[filter] Set coords by map';
  constructor(public payload: Coords) {}
}

export class ClearCoordsByMap {
  static readonly type = '[filter] Clear coords by map';
}

export class SetRadiusSize {
  static readonly type = '[filter] Set Radius Size';
  constructor(public payload: number) {}
}

export class ClearRadiusSize {
  static readonly type = '[filter] Clear Radius Size';
}

export class SetMapView {
  static readonly type = '[filter] Set Map View';
  constructor(public payload: boolean) {}
}

export class SetFilterFromURL {
  static readonly type = '[filter] Set Filter from URL';
  constructor(public payload: Partial<DefaultFilterState>) {}
}
