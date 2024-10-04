import {
  MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition,
  MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition
} from '@angular/material/legacy-snack-bar';

import { MessageBarType } from 'shared/enum/message-bar';

export interface MessageBarData {
  message: string;
  type: MessageBarType;
  verticalPosition?: MatSnackBarVerticalPosition;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  info?: string;
  duration?: number;
  infinityDuration?: boolean;
  unclosable?: boolean;
}
