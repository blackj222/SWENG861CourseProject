import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEmployeeInformation } from '../employee-information.model';

@Component({
  standalone: true,
  selector: 'jhi-employee-information-detail',
  templateUrl: './employee-information-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EmployeeInformationDetailComponent {
  employeeInformation = input<IEmployeeInformation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
