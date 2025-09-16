import { MatDateFormats } from '@angular/material/core';

export const LOCAL_STUDY_PERIOD_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['DD/MMM', 'DD/MM']
  },
  display: {
    dateInput: 'DD/MMM',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy'
  }
};
