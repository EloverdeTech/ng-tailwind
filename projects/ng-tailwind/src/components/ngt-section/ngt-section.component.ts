import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    Injector,
    input,
    Optional,
    output,
    Self,
    signal,
    ViewChild,
    WritableSignal,
    effect,
    Input
} from '@angular/core';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtSectionComponent implements AfterViewInit {
    @ViewChild('elementRef') public elementRef: ElementRef;

    /** Inputs */

    public readonly name = input<string>();
    public readonly icon = input<string>();
    public readonly caption = input<string>();
    public readonly subtitle = input<string>();
    public readonly accordion = input<boolean>(false);
    public readonly removable = input<boolean>(false);
    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpIconColor = input<string>();
    // public readonly showSection = input<boolean>(true);

    // TODO: CHANGE THIS TO SIGNAL
    @Input() public showSection: boolean = true;

    /** Outputs */

    public readonly onRemove = output<void>();
    public readonly onToggleSection = output<boolean>();

    /** Signals */

    public readonly isDisabled = input<boolean>();
    public readonly isDisabledState = computed(() => this.isDisabled() || this.internalDisabledState());
    public readonly canDisplayState: WritableSignal<boolean> = signal(false);

    public ngtSectionStyle: NgtStylizableService;
    public ngtCaptionStyle: NgtStylizableService;
    public ngtSubtitleStyle: NgtStylizableService;

    private readonly internalDisabledState: WritableSignal<boolean> = signal(false);

    public constructor(
        private injector: Injector,

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
            mb: 'mb-6',
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
        if (!this.ngtAbilityValidationService || !this.name()) {
            this.canDisplayState.set(true);

            return;
        }

        if (this.ngtAbilityValidationService && this.name()) {
            if (this.isDisabled() === undefined) {
                this.internalDisabledState.set(
                    !(await this.ngtAbilityValidationService.isSectionEnabled(this.name()))
                );
            }

            this.canDisplayState.set(
                !(await this.ngtAbilityValidationService.isSectionHidden(this.name()))
            );
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

    public scrollTo(): void {
        this.elementRef.nativeElement.scrollIntoView({ behavior: "smooth" });
    }

    public remove(event: Event): void {
        event.stopImmediatePropagation();

        this.onRemove.emit();
    }
}
