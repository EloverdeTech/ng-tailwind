import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ngt-select-page',
    templateUrl: './ngt-select-page.component.html',
    styleUrls: ['./ngt-select-page.component.css']
})
export class NgtSelectPageComponent implements OnInit {
    public exampleItems = [
        {
            id: 1,
            backendText: 'Backend test',
            fontendText: 'Option one'
        },
        {
            id: 2,
            backendText: 'Backend test',
            fontendText: 'Option two'
        },
        {
            id: 3,
            backendText: 'Backend test',
            fontendText: 'Option three'
        },
        {
            id: 4,
            backendText: 'Backend test',
            fontendText: 'Option four'
        },
        {
            id: 5,
            backendText: 'Backend test',
            fontendText: 'Option five'
        },
        {
            id: 6,
            backendText: 'Backend test',
            fontendText: 'Option six'
        },
        {
            id: 7,
            backendText: 'Backend test',
            fontendText: 'Option seven'
        },
        {
            id: 8,
            backendText: 'Backend test',
            fontendText: 'Option eight'
        },
        {
            id: 9,
            backendText: 'Backend test',
            fontendText: 'Option nine'
        },
    ];

    public codeExample = `
  <ngt-select class='block w-full' [items]='exampleItems' bindLabel='text' 
    label='Ngt Select' name='ngtSelect' [(ngModel)]="ngtSelect" 
    [searchable]='false'>
    <ng-template let-item="item" let-index="index" ngt-select-option>
      {{  item ? item.fontendText : '' }}
    </ng-template>
  </ngt-select>

  <ngt-select class='block w-full' [items]='exampleItems' bindLabel='text' 
    label='Ngt Select Multiple' name='ngtSelectMultiple' [multiple]='true'
    [(ngModel)]="ngtSelectMultiple" [searchable]='false'>
    <ng-template let-item="item" let-index="index" ngt-select-option>
      {{  item ? item.fontendText : '' }}
    </ng-template>
  </ngt-select>
  `;

    public ngtSelect: any;
    public ngtSelectMultiple: any;

    public constructor() { }

    public ngOnInit() { }
}
