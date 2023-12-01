import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Injector, Input, OnChanges, Optional, Output, Self, SimpleChanges } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-section',
    templateUrl: './ngt-section.component.html',
    animations: [
        trigger('enterAnimation', [
            state('void', style({ transform: 'translateY(-20px)', opacity: 0 })),
            transition(':enter', [
                animate(400)
            ])
        ]),
    ]
})
export class NgtSectionComponent implements OnChanges {
    @Input() public icon: string;
    @Input() public caption: string;
    @Input() public subtitle: string;
    @Input() public accordion: boolean;
    @Input() public showSection: boolean = true;
    @Input() public removable: boolean;
    @Input() public helpTitle: string;
    @Input() public helpText: string;
    @Input() public helpIconColor: string;
    @Input() public isDisabled: boolean;

    @Output() public onRemove: EventEmitter<void> = new EventEmitter();
    @Output() public onToggleSection: EventEmitter<boolean> = new EventEmitter();
    @Output() public onIsDisabledChange: EventEmitter<boolean> = new EventEmitter;

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

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isDisabled) {
            this.onIsDisabledChange.emit(changes.isDisabled.currentValue);
        }
    }

    public open(): void {
        this.showSection = true;

        this.onToggleSection.emit(this.showSection);
    }

    public close(): void {
        this.showSection = false;

        this.onToggleSection.emit(this.showSection);
    }

    public toggle(): void {
        this.showSection = !this.showSection;

        this.onToggleSection.emit(this.showSection);
    }

    public remove(event: Event): void {
        event.stopImmediatePropagation();

        this.onRemove.emit();
    }
}
