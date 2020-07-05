import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ngt-input-page',
    templateUrl: './ngt-input-page.component.html',
    styleUrls: ['./ngt-input-page.component.css']
})
export class NgtInputPageComponent implements OnInit {
    public allowClearInput: string;
    public decimalInput: string;
    public cpfCnpj: string;
    public password: string;
    public passwordConfirm: string;

    public codeExample = `
  <ngt-input class="block" [jit]='true' name='allowClearInput' 
    [(ngModel)]="allowClearInput" label='Allow Clear Input' 
    [isRequired]='true' [allowClear]='true'>
  </ngt-input>

  <ngt-input class="block" name='decimalInput' 
    [(ngModel)]="decimalInput" label='Decimal Input'
    innerLeftIcon='assets/images/icons/keyboard.svg' mask='decimal'>
  </ngt-input>

  <ngt-input class="block" name='cpfCnpj' label='CPF/CNPJ' [(ngModel)]="cpfCnpj" 
    mask='cnpj-cpf'>
  </ngt-input>

  <ngt-input class="block" name='passwordInput' label='Password' type='password'
    [(ngModel)]="password">
  </ngt-input>

  <ngt-input class="block" name='passwordConfirm' label='Password Confirm' 
    type='password' [(ngModel)]="passwordConfirm" [match]='password'>
  </ngt-input>
  `;

    public constructor() { }

    public ngOnInit() { }
}
