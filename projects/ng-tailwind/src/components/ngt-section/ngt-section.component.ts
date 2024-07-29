import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, Optional, Output, Self, ViewChild } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtAbilityValidationService } from '../../services/validation/ngt-ability-validation.service';;

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
export class NgtSectionComponent implements AfterViewInit {
    @ViewChild('elementRef') public elementRef: ElementRef;

    @Input() public name: string;
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

    public ngtSectionStyle: NgtStylizableService;
    public ngtCaptionStyle: NgtStylizableService;
    public ngtSubtitleStyle: NgtStylizableService;

    public canDisplay: boolean;

    public constructor(
        private injector: Injector,
        private changeDetector: ChangeDetectorRef,

        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional()
        private ngtAbilityValidationService: NgtAbilityValidationService
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
            border: 'border-b-4 md:border-b-0 border-dashed md:border-solid md:border-l',
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
            px: 'px-5',
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

    public async ngAfterViewInit(): Promise<void> {
        if (!this.ngtAbilityValidationService || !this.name) {
            this.canDisplay = true;

            this.changeDetector.detectChanges();
        }

        if (this.ngtAbilityValidationService && this.name) {
            if (this.isDisabled === undefined) {
                this.isDisabled = !(await this.ngtAbilityValidationService.isSectionEnabled(this.name));
            }

            this.canDisplay = !(await this.ngtAbilityValidationService.isSectionHidden(this.name));
        }

        this.changeDetector.detectChanges();
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

    public scrollTo(): void {
        this.elementRef.nativeElement.scrollIntoView({ behavior: "smooth" });
    }

    public remove(event: Event): void {
        event.stopImmediatePropagation();

        this.onRemove.emit();
    }
}
