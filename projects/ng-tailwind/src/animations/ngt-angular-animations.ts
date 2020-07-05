import { animate, AnimationStyleMetadata, state, style, transition, trigger } from '@angular/animations';

export function slideLeftToRightAnimation(name: string, duration: any, customStyle?: AnimationStyleMetadata) {
    return trigger(name, [
        state('void', customStyle ? customStyle : style({ transform: 'translateX(-50px)', opacity: 0 })),
        transition(':enter, :leave', [
            animate(duration)
        ])
    ]);
}

export function slideRightToLeftAnimation(name: string, duration: any, customStyle?: AnimationStyleMetadata) {
    return trigger(name, [
        state('void', customStyle ? customStyle : style({ transform: 'translateX(50px)', opacity: 0 })),
        transition(':enter, :leave', [
            animate(duration)
        ])
    ]);
}

export function fadeDownAnimation(name: string, duration: any, customStyle?: AnimationStyleMetadata) {
    return trigger(name, [
        state('void', customStyle ? customStyle : style({ transform: 'translateY(-20px)', opacity: 0 })),
        transition(':enter, :leave', [
            animate(duration)
        ])
    ]);
}

export function fadeUpAnimation(name: string, duration: any, customStyle?: AnimationStyleMetadata) {
    return trigger(name, [
        state('void', customStyle ? customStyle : style({ transform: 'translateY(20px)', opacity: 0 })),
        transition(':enter, :leave', [
            animate(duration)
        ])
    ]);
}
