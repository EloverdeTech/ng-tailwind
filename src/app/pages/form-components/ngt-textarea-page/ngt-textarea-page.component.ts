import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ngt-textarea-page',
  templateUrl: './ngt-textarea-page.component.html'
})
export class NgtTextareaPageComponent implements OnInit {
  public ngtTextarea: string;

  public codeExample = `
  <ngt-textarea class="block" [jit]='true' name='ngtTextarea' [(ngModel)]="ngtTextarea"
    label='Ngt Textarea' placeholder='Type it...' rows='4'>
  </ngt-textarea>
  `;

  public constructor() { }

  public ngOnInit() { }
}
