import { AfterViewInit, Component, Input } from '@angular/core';

declare var hljs: any;

@Component({
  selector: 'code-preview',
  templateUrl: './code-preview.component.html',
  styleUrls: ['./code-preview.component.css']
})
export class CodePreviewComponent implements AfterViewInit {

  @Input() public lang = 'html';

  constructor() { }

  ngAfterViewInit() {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    });
  }
}
