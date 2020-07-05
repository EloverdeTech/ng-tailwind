import { AfterViewInit, Component, Input } from '@angular/core';

declare let hljs: any;

@Component({
    selector: 'code-preview',
    templateUrl: './code-preview.component.html',
    styleUrls: ['./code-preview.component.css']
})
export class CodePreviewComponent implements AfterViewInit {
    @Input() public lang = 'html';

    public constructor() { }

    public ngAfterViewInit() {
        setTimeout(() => {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        });
    }
}
