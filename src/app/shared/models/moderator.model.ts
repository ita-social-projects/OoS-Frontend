import { BaseAdminBlockData, BaseAdminParameters } from './admin.model';
import { AreaAdmin } from './area-admin.model';

export class Moderator extends AreaAdmin {}

export type ModeratorParameters = BaseAdminParameters;
export type ModeratorBlockData = BaseAdminBlockData;
