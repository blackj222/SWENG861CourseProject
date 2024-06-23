import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEmployeeInformation } from '../employee-information.model';
import { EmployeeInformationService } from '../service/employee-information.service';

@Component({
  standalone: true,
  templateUrl: './employee-information-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EmployeeInformationDeleteDialogComponent {
  employeeInformation?: IEmployeeInformation;

  protected employeeInformationService = inject(EmployeeInformationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.employeeInformationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
