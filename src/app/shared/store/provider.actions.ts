import { HttpErrorResponse } from '@angular/common/http';

import { Achievement, AchievementParameters } from 'shared/models/achievement.model';
import { ApplicationFilterParameters } from 'shared/models/application.model';
import { BlockedParent, EmployeeBlockData } from 'shared/models/block.model';
import { Position, PositionParameters } from 'shared/models/position.model';
import { Employee, EmployeeParameters } from 'shared/models/employee.model';
import { Provider, ProviderParameters, ProviderWithLicenseStatus, ProviderWithStatus } from 'shared/models/provider.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import {
  Workshop,
  WorkshopCardParameters,
  WorkshopDraft,
  WorkshopDraftCard,
  WorkshopProviderViewCard,
  WorkshopStatus
} from 'shared/models/workshop.model';
import {
  WorkshopContacts,
  WorkshopDescription,
  WorkshopMainRequiredProperties,
  WorkshopOtherRequiredProperties
} from 'shared/models/draftWorkshop.model';
import { StudySubject, StudySubjectParameters } from 'shared/models/study-subject.model';
import { Competition, CompetitionCardParameters, CompetitionProviderViewCard } from 'shared/models/competition.model';

export class GetAchievementById {
  static readonly type = '[provider] get achievement By Id';
  constructor(public payload: string) {}
}

export class GetChildrenByWorkshopId {
  static readonly type = '[provider] get Children By Workshop Id';
  constructor(public payload: string) {}
}

export class GetAchievementsByWorkshopId {
  static readonly type = '[provider] get Achievements By Workshop Id';
  constructor(public payload: AchievementParameters) {}
}

export class UpdateAchievement {
  static readonly type = '[provider] update Achievement';
  constructor(public payload: Achievement) {}
}

export class OnUpdateAchievementFail {
  static readonly type = '[provider] update Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateAchievementSuccess {
  static readonly type = '[provider] update Achievement success';
  constructor(public payload: Achievement) {}
}

export class DeleteAchievementById {
  static readonly type = '[provider] delete Achievement';
  constructor(public payload: Achievement) {}
}

export class CreateAchievement {
  static readonly type = '[provider] create Achievement';
  constructor(public payload: Achievement) {}
}

export class OnCreateAchievementFail {
  static readonly type = '[provider] create Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateAchievementSuccess {
  static readonly type = '[provider] create Achievement success';
  constructor(public payload: Achievement) {}
}

export class OnDeleteAchievementSuccess {
  static readonly type = '[provider] delete Achievement success';
  constructor(public payload: Achievement) {}
}

export class OnDeleteAchievementFail {
  static readonly type = '[provider] delete Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetEmployeeWorkshops {
  static readonly type = '[provider] get Workshops for Employee';
  constructor(public parameters: PaginationParameters) {}
}

export class GetProviderViewWorkshops {
  static readonly type = '[provider] get Workshops for provider cabinet';
  constructor(public workshopCardParameters: WorkshopCardParameters) {}
}

export class GetProviderViewWorkshopDrafts {
  static readonly type = '[provider] get Workshops Drafts for provider cabinet';
  constructor(public workshopCardParameters: WorkshopCardParameters) {}
}

export class GetProviderViewCompetitions {
  static readonly type = '[provider] get Competitions for provider cabinet';
  constructor(public competitionCardParameters: CompetitionCardParameters) {}
}

export class GetFilteredOfficialEmployees {
  static readonly type = '[provider] get filtered Official Employee users';
  constructor(public payload: EmployeeParameters) {}
}

export class GetFilteredEmployees {
  static readonly type = '[provider] get filtered Employee users';
  constructor(public payload: EmployeeParameters) {}
}

export class GetWorkshopListByProviderId {
  static readonly type = '[user] get Workshop List By Provider Id';
  constructor(public payload: string) {}
}

export class GetWorkshopDraftListByProviderId {
  static readonly type = '[user] get Workshop Draft List By Provider Id';
  constructor(public payload: string) {}
}

export class DraftSendForModeration {
  static readonly type = '[user] send Draft for Moderation';
  constructor(public id: number) {}
}

export class OnDraftSendForModerationFail {
  static readonly type = '[provider] send for Moderation fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnDraftSendForModerationSuccess {
  static readonly type = '[provider] send for Moderation success';
  constructor(public payload: void) {}
}

export class GetWorkshopListByEmployeeId {
  static readonly type = '[user] get Workshop List By Employee Id';
  constructor(public id: string) {}
}

export class OnCreateWorkshopFail {
  static readonly type = '[provider] create Workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateWorkshopSuccess {
  static readonly type = '[provider] create Workshop success';
  constructor(public payload: Workshop) {}
}

export class UpdateWorkshop {
  static readonly type = '[provider] update Workshop';
  constructor(public payload: Workshop) {}
}

export class OnUpdateWorkshopFail {
  static readonly type = '[provider] update Workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateWorkshopSuccess {
  static readonly type = '[provider] update Workshop success';
  constructor(public payload: Workshop) {}
}

export class DeleteWorkshopById {
  static readonly type = '[provider] delete Workshop';
  constructor(
    public id: string,
    public parameters: WorkshopCardParameters
  ) {}
}

export class OnDeleteWorkshopSuccess {
  static readonly type = '[provider] delete Workshop success';
  constructor(public parameters: WorkshopCardParameters) {}
}

export class OnDeleteWorkshopFail {
  static readonly type = '[provider] delete Workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class CreateWorkshopDraft {
  static readonly type = '[provider] create Draft';
  constructor(public payload: Workshop) {}
}

export class UpdateDraft {
  static readonly type = '[provider] update Draft';
  constructor(public payload: Workshop) {}
}

export class DeleteWorkshopDraftById {
  static readonly type = '[provider] delete Draft';
  constructor(
    public payload: WorkshopDraftCard,
    public parameters: WorkshopCardParameters
  ) {}
}

export class OnDeleteDraftSuccess {
  static readonly type = '[provider] delete Draft success';
  constructor(public parameters: WorkshopCardParameters) {}
}

export class OnDeleteDraftFail {
  static readonly type = '[provider] delete Draft fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class PublishWorkshop {
  static readonly type = '[provider] publish Workshop';
  constructor(public payload: string) {}
}

export class OnPublishWorkshopSuccess {
  static readonly type = '[provider] publish Workshop success';
  constructor() {}
}

export class OnPublishWorkshopFail {
  static readonly type = '[provider] publish Workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class CreateProvider {
  static readonly type = '[provider] create Provider';
  constructor(
    public payload: Provider,
    public isImagesFeature: boolean
  ) {}
}

export class OnCreateProviderFail {
  static readonly type = '[provider] create Provider fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateProviderSuccess {
  static readonly type = '[provider] create Provider success';
  constructor(public payload: Provider) {}
}

export class UpdateProvider {
  static readonly type = '[provider] update Provider';
  constructor(
    public payload: Provider,
    public isImagesFeature: boolean
  ) {}
}

export class OnUpdateProviderFail {
  static readonly type = '[provider] update Provider fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateProviderSuccess {
  static readonly type = '[provider] update Provider success';
  constructor() {}
}

export class UpdateProviderStatus {
  static readonly type = '[provider] update Provider status';
  constructor(
    public payload: ProviderWithStatus,
    public providerParameters: ProviderParameters
  ) {}
}

export class UpdateProviderLicenseStatus {
  static readonly type = '[provider] update provider license status';
  constructor(
    public payload: ProviderWithLicenseStatus,
    public providerParameters: ProviderParameters
  ) {}
}

export class OnUpdateProviderStatusFail {
  static readonly type = '[provider] update Provider status fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateProviderStatusSuccess {
  static readonly type = '[provider] update Provider status success';
  constructor(
    public payload: ProviderWithStatus,
    public providerParameters: ProviderParameters
  ) {}
}

export class CreateEmployee {
  static readonly type = '[provider] create Employee';
  constructor(public payload: Employee) {}
}

export class OnCreateEmployeeFail {
  static readonly type = '[provider] create Employee fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateEmployeeSuccess {
  static readonly type = '[provider] create Employee success';
  constructor(public payload: Employee) {}
}

export class BlockEmployeeById {
  static readonly type = '[provider] block Employee';
  constructor(
    public payload: EmployeeBlockData,
    public filterParams: EmployeeParameters
  ) {}
}

export class OnBlockEmployeeSuccess {
  static readonly type = '[provider] block Employee success';
  constructor(
    public payload: EmployeeBlockData,
    public filterParams: EmployeeParameters
  ) {}
}

export class OnBlockEmployeeFail {
  static readonly type = '[provider] block Employee fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteEmployeeById {
  static readonly type = '[provider] delete Employee';
  constructor(
    public payload: EmployeeBlockData,
    public filterParams: EmployeeParameters
  ) {}
}

export class OnDeleteEmployeeSuccess {
  static readonly type = '[provider] delete Employee success';
  constructor(public filterParams: EmployeeParameters) {}
}

export class OnDeleteEmployeeFail {
  static readonly type = '[provider] delete Employee fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateEmployee {
  static readonly type = '[provider] update Employee';
  constructor(
    public providerId: string,
    public employee: Employee
  ) {}
}

export class OnUpdateEmployeeFail {
  static readonly type = '[provider] update Employee fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateEmployeeSuccess {
  static readonly type = '[provider] update Employee success';
  constructor(public payload: Employee) {}
}

export class UpdateWorkshopStatus {
  static readonly type = '[provider] update Status';
  constructor(
    public payload: WorkshopStatus,
    public providerId: string
  ) {}
}

export class OnUpdateWorkshopStatusSuccess {
  static readonly type = '[provider] update Status success';
  constructor(public payload: string) {}
}

export class OnUpdateWorkshopStatusFail {
  static readonly type = '[provider] update Status fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class BlockParent {
  static readonly type = '[provider] block parent';
  constructor(
    public payload: BlockedParent,
    public parameters?: ApplicationFilterParameters
  ) {}
}

export class BlockParentFail {
  static readonly type = '[provider] block parent fail';
  constructor(public payload: Error) {}
}

export class BlockParentSuccess {
  static readonly type = '[provider] block parent success';
  constructor(public payload: BlockedParent) {}
}

export class UnBlockParent {
  static readonly type = '[provider] unblock parent';
  constructor(
    public payload: BlockedParent,
    public parameters?: ApplicationFilterParameters
  ) {}
}

export class UnBlockParentFail {
  static readonly type = '[provider] unblock parent fail';
  constructor(public payload: Error) {}
}

export class UnBlockParentSuccess {
  static readonly type = '[provider] unblock parent success';
  constructor(public payload: BlockedParent) {}
}

export class GetBlockedParents {
  static readonly type = '[provider] get block parent';
  constructor(
    public providerId: string,
    public parentId: string
  ) {}
}

export class OnClearBlockedParents {
  static readonly type = '[provider] clear blockedParents state';
  constructor() {}
}

export class ResetAchievements {
  static readonly type = '[provider] reset achievements';
  constructor() {}
}

export class DeleteProviderById {
  static readonly type = '[provider] delete Provider By Id';
  constructor(
    public payload: string,
    public providerParameters: ProviderParameters
  ) {}
}

export class OnDeleteProviderByIdSuccess {
  static readonly type = '[provider] delete Provider By Id success';
  constructor(
    public payload: string,
    public providerParameters: ProviderParameters
  ) {}
}

export class OnDeleteProviderByIdFail {
  static readonly type = '[provider] delete Provider By Id fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetEmployeeById {
  static readonly type = '[provider] get Employee by id';
  constructor(public payload: string) {}
}

export class ReinviteEmployee {
  static readonly type = '[provider] reinvites Employee';
  constructor(public employee: Employee) {}
}

export class GetPendingApplicationsByProviderId {
  static readonly type = '[provider] Get Pending Applications By Provider Id';
  constructor(public id: string) {}
}

export class OnSaveWorkshopStep {
  static readonly type = '[Workshop] save Workshop step';
  constructor(
    public payload: {
      data: Partial<WorkshopMainRequiredProperties | WorkshopOtherRequiredProperties | WorkshopDescription | WorkshopContacts>;
      step: number;
    }
  ) {}
}

export class OnSaveWorkshopStepFail {
  static readonly type = '[Provider] On Save Workshop Step Fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnSaveWorkshopStepSuccess {
  static readonly type = '[Provider] On Save Workshop Step Success';
  constructor(public payload: { step: number; data: any }) {}
}

export class OnDeleteUnfinishedWorkshop {
  static readonly type: string = '[provider] clear unfinished workshop';
}

export class OnDeleteUnfinishedWorkshopFail {
  static readonly type: string = '[provider] clear unfinished workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnDeleteUnfinishedWorkshopSuccess {
  static readonly type: string = '[provider] clear unfinished workshop success';
}

export class GetUnfinishedWorkshop {
  static readonly type: string = '[provider] get unfinished workshop';
}

export class GetUnfinishedWorkshopSuccess {
  static readonly type: string = '[provider] get unfinished workshop success';
  constructor(public payload: Workshop) {}
}

export class GetUnfinishedWorkshopFail {
  static readonly type: string = '[provider] get unfinished workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetUnfinishedWorkshopTimeToLive {
  static readonly type = '[provider] get time to live of unfinished workshop';
}

export class GetUnfinishedWorkshopTimeToLiveSuccess {
  static readonly type = '[provider] get time to live of unfinished workshop success';
  constructor(public payload: string) {}
}

export class GetUnfinishedWorkshopTimeToLiveFail {
  static readonly type = '[provider] get time to live of unfinished workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class SetDraftModalShown {
  static readonly type = '[provider] set modal shown';
  constructor(public payload: boolean) {}
}

export class GetPositions {
  static readonly type = '[provider] Get positions by provider Id';
  constructor(public positionParameters: PositionParameters) {}
}

export class OnGetPositionsFail {
  static readonly type = '[provider] Get positions fail';
  constructor(public error: HttpErrorResponse) {}
}

export class CreatePosition {
  static readonly type = '[provider] Create position';
  constructor(public position: Position) {}
}

export class OnCreatePositionSuccess {
  static readonly type = '[provider] Create position success';
  constructor(public position: Position) {}
}

export class OnCreatePositionFail {
  static readonly type = '[provider] create position fail';
  constructor(public error: HttpErrorResponse) {}
}

export class UpdatePosition {
  static readonly type = '[provider] Update postion';
  constructor(public position: Position) {}
}

export class OnUpdatePositionSuccess {
  static readonly type = '[provider] Update position success';
  constructor(public position: Position) {}
}

export class OnUpdatePositionFail {
  static readonly type = '[provider] update position fail';
  constructor(public error: HttpErrorResponse) {}
}

export class DeletePositionById {
  static readonly type = '[provider] Delete position by id';
  constructor(
    public positionParameters: PositionParameters,
    public positionId: string
  ) {}
}

export class OnDeletePositionSuccess {
  static readonly type = '[provider] Delete position success';
  constructor(public positionParameters: PositionParameters) {}
}

export class OnDeletePositionFail {
  static readonly type = '[provider] Delete position fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetPositionById {
  static readonly type = '[provider] Get position by position Id';
  constructor(
    public positionId: string,
    public providerId: string
  ) {}
}

export class OnGetPositionByIdFail {
  static readonly type = '[provider] Get position by id fail';
  constructor(public error: HttpErrorResponse) {}
}

export class GetLanguageList {
  static readonly type = '[provider] get language list';
  constructor() {}
}

export class CreateStudySubject {
  static readonly type = '[provider] create study subject';
  constructor(public payload: StudySubject) {}
}

export class OnCreateStudySubjectSuccess {
  static readonly type = '[provider] create study subject success';
  constructor(public payload: StudySubject) {}
}

export class OnCreateStudySubjectFail {
  static readonly type = '[provider] create study subject fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetStudySubjects {
  static readonly type = '[provider] get study subjects';
  constructor(public payload: StudySubjectParameters) {}
}

export class GetStudySubjectById {
  static readonly type = '[provider] get study subjects by id';
  constructor(
    public subjectId: string,
    public providerId: string
  ) {}
}

export class UpdateStudySubject {
  static readonly type = '[provider] update study subject';
  constructor(public payload: StudySubject) {}
}

export class OnUpdateStudySubjectSuccess {
  static readonly type = '[provider] update study subject success';
  constructor(public payload: StudySubject) {}
}

export class OnUpdateStudySubjectFail {
  static readonly type = '[provider] update study subject fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteStudySubjectById {
  static readonly type = '[provider] delete study subject by id';
  constructor(
    public subjectParameters: StudySubjectParameters,
    public subjectId: string
  ) {}
}

export class OnDeleteStudySubjectSuccess {
  static readonly type = '[provider] delete study subject success';
  constructor(public parameters: StudySubjectParameters) {}
}

export class OnDeleteStudySubjectFail {
  static readonly type = '[provider] delete study subject fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class CreateCompetition {
  static readonly type = '[provider] create Competition';
  constructor(public payload: Competition) {}
}

export class OnCreateCompetitionFail {
  static readonly type = '[provider] create Competition fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateCompetitionSuccess {
  static readonly type = '[provider] create Competition success';
  constructor(public payload: Competition) {}
}

export class UpdateCompetition {
  static readonly type = '[provider] update Competition';
  constructor(public payload: Competition) {}
}

export class OnUpdateCompetitionFail {
  static readonly type = '[provider] update Competition fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateCompetitionSuccess {
  static readonly type = '[provider] update Competition success';
  constructor(public payload: Competition) {}
}

export class DeleteCompetitionById {
  static readonly type = '[provider] delete Competition by id';
  constructor(
    public competition: CompetitionProviderViewCard,
    public parameters: CompetitionCardParameters
  ) {}
}

export class DeleteCompetitionByIdFail {
  static readonly type = '[provider] delete Competition by id fail';
  constructor(public error: HttpErrorResponse) {}
}

export class DeleteCompetitionByIdSuccess {
  static readonly type = '[provider] delete Competition by id success';
  constructor(public competition: CompetitionCardParameters) {}
}
