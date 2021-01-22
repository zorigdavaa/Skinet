import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';
import { IAddress } from 'src/app/shared/Models/Address';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkOutForm: FormGroup;

  constructor(private accountService: AccountService, private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  SaveAddressToDB() {
    this.accountService.updateUserAddress(this.checkOutForm.get('addressForm').value)
    .subscribe((address: IAddress)=> {
      this.checkOutForm.get('addressForm').reset(address);
      this.toastr.success('Address Saved Successfully');
    }, error => {
      this.toastr.error(error.message, 'Error saving address');
      console.log(error)
    })
    console.log(this.checkOutForm.get('addressForm').value)
  }
}
