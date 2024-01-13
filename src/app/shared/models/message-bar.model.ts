import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { MessageBarType } from 'shared/enum/message-bar';

export interface MessageBarData {
  message: string;
  type: MessageBarType;
  verticalPosition?: MatSnackBarVerticalPosition;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  info?: string;
  infinityDuration?: boolean;
  unclosable?: boolean;
}
