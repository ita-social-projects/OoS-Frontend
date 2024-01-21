import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { MessageBarType } from 'shared/enum/messageBar';

export interface MessageBarData {
  message: string;
  type: MessageBarType;
  verticalPosition?: MatSnackBarVerticalPosition;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  info?: string;
  infinityDuration?: boolean;
  unclosable?: boolean;
}
