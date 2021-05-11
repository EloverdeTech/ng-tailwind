import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Injector, Input, Optional, Output, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-section',
    templateUrl: './ngt-section.component.html',
    styleUrls: ['./ngt-section.component.css'],
    animations: [
        trigger('enterAnimation', [
            state('void', style({ transform: 'translateY(-20px)', opacity: 0 })),
            transition(':enter', [
                animate(400)
            ])
        ]),
    ]
})
export class NgtSectionComponent {
    @Input() public icon: string;
    @Input() public caption: string;
    @Input() public subtitle: string;
    @Input() public accordion = false;
    @Input() public showSection = true;
    @Input() public helpTitle: string = '';
    @Input() public helpText: string = '';
    @Input() public helpIconColor: string = '';

    @Output() public onToggleSection: EventEmitter<any> = new EventEmitter();

    public ngtSectionStyle: NgtStylizableService;
    public ngtCaptionStyle: NgtStylizableService;
    public ngtSubtitleStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective
    ) {
        this.ngtCaptionStyle = new NgtStylizableService();
        this.ngtSubtitleStyle = new NgtStylizableService();

        if (this.ngtStylizableDirective) {
            this.ngtSectionStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtSectionStyle = new NgtStylizableService();
        }

        this.ngtSectionStyle.load(this.injector, 'NgtSection', {
            h: 'h-12',
            w: 'w-12',
            my: 'my-1',
            pr: 'pr-1',
            px: 'md:px-5',
            color: {
                text: 'text-gray-800'
            }
        });

        this.ngtCaptionStyle.load(this.injector, 'NgtSectionCaption', {
            text: 'text-sm',
            font: 'font-normal',
            ml: 'ml-2',
            pb: 'pb-2',
            border: 'border-none',
            color: {
                text: 'text-gray-800',
                border: ''
            }
        });

        this.ngtSubtitleStyle.load(this.injector, 'NgtSectionSubtitle', {
            text: 'text-xs',
            font: 'font-normal',
            border: 'border-none',
            ml: 'ml-2',
            color: {
                text: 'text-gray-500',
                border: ''
            }
        });
    }

    public open() {
        this.showSection = true;
        this.onToggleSection.emit(this.showSection);
    }

    public close() {
        this.showSection = false;
        this.onToggleSection.emit(this.showSection);
    }

    public toggle() {
        this.showSection = !this.showSection;
        this.onToggleSection.emit(this.showSection);
    }
}
