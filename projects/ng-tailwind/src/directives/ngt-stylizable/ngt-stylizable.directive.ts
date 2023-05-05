import { Directive, Input } from '@angular/core';

import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Directive({
    selector: '[ngt-stylizable]'
})
export class NgtStylizableDirective {
    private ngtStylizableService: NgtStylizableService;

    public constructor() {
        this.ngtStylizableService = new NgtStylizableService();
    }

    public get color() {
        return this.ngtStylizableService.color;
    }

    public get h(): string {
        return this.ngtStylizableService.h;
    }

    public get w(): string {
        return this.ngtStylizableService.w;
    }

    public get p(): string {
        return this.ngtStylizableService.p;
    }

    public get px(): string {
        return this.ngtStylizableService.px;
    }

    public get py(): string {
        return this.ngtStylizableService.py;
    }

    public get pt(): string {
        return this.ngtStylizableService.pt;
    }

    public get pr(): string {
        return this.ngtStylizableService.pr;
    }

    public get pb(): string {
        return this.ngtStylizableService.pb;
    }

    public get pl(): string {
        return this.ngtStylizableService.pl;
    }

    public get m(): string {
        return this.ngtStylizableService.m;
    }

    public get mx(): string {
        return this.ngtStylizableService.mx;
    }

    public get my(): string {
        return this.ngtStylizableService.my;
    }

    public get mt(): string {
        return this.ngtStylizableService.mt;
    }

    public get mr(): string {
        return this.ngtStylizableService.mr;
    }

    public get mb(): string {
        return this.ngtStylizableService.mb;
    }

    public get ml(): string {
        return this.ngtStylizableService.ml;
    }

    public get border(): string {
        return this.ngtStylizableService.border;
    }

    public get shadow(): string {
        return this.ngtStylizableService.shadow;
    }

    public get rounded(): string {
        return this.ngtStylizableService.rounded;
    }

    public get font(): string {
        return this.ngtStylizableService.font;
    }

    public get text(): string {
        return this.ngtStylizableService.text;
    }

    public get breakWords(): string {
        return this.ngtStylizableService.breakWords;
    }

    public get overflow(): string {
        return this.ngtStylizableService.overflow;
    }

    public get position(): string {
        return this.ngtStylizableService.position;
    }

    public get justifyContent(): string {
        return this.ngtStylizableService.justifyContent;
    }

    public get cursor(): string {
        return this.ngtStylizableService.cursor;
    }

    public get fontCase(): string {
        return this.ngtStylizableService.fontCase;
    }

    @Input('color')
    public set color(color) {
        this.ngtStylizableService.color = color;
    }

    @Input('color.text')
    public set textColor(textColor: string) {
        this.ngtStylizableService.textColor = textColor;
    }

    @Input('color.bg')
    public set bgColor(bgColor: string) {
        this.ngtStylizableService.bgColor = bgColor;
    }

    @Input('color.border')
    public set borderColor(borderColor) {
        this.ngtStylizableService.borderColor = borderColor;
    }

    @Input('h')
    public set h(h: string) {
        this.ngtStylizableService.h = h;
    }

    @Input('w')
    public set w(w: string) {
        this.ngtStylizableService.w = w;
    }

    @Input('p')
    public set p(p: string) {
        this.ngtStylizableService.p = p;
    }

    @Input('px')
    public set px(px: string) {
        this.ngtStylizableService.px = px;
    }

    @Input('py')
    public set py(py: string) {
        this.ngtStylizableService.py = py;
    }

    @Input('pt')
    public set pt(pt: string) {
        this.ngtStylizableService.pt = pt;
    }

    @Input('pr')
    public set pr(pr: string) {
        this.ngtStylizableService.pr = pr;
    }

    @Input('pb')
    public set pb(pb: string) {
        this.ngtStylizableService.pb = pb;
    }

    @Input('pl')
    public set pl(pl: string) {
        this.ngtStylizableService.pl = pl;
    }

    @Input('m')
    public set m(m: string) {
        this.ngtStylizableService.m = m;
    }

    @Input('mx')
    public set mx(mx: string) {
        this.ngtStylizableService.mx = mx;
    }

    @Input('my')
    public set my(my: string) {
        this.ngtStylizableService.my = my;
    }

    @Input('mt')
    public set mt(mt: string) {
        this.ngtStylizableService.mt = mt;
    }

    @Input('mr')
    public set mr(mr: string) {
        this.ngtStylizableService.mr = mr;
    }

    @Input('mb')
    public set mb(mb: string) {
        this.ngtStylizableService.mb = mb;
    }

    @Input('ml')
    public set ml(ml: string) {
        this.ngtStylizableService.ml = ml;
    }

    @Input('border')
    public set border(border: string) {
        this.ngtStylizableService.border = border;
    }

    @Input('shadow')
    public set shadow(shadow: string) {
        this.ngtStylizableService.shadow = shadow;
    }

    @Input('rounded')
    public set rounded(rounded: string) {
        this.ngtStylizableService.rounded = rounded;
    }

    @Input('font')
    public set font(font: string) {
        this.ngtStylizableService.font = font;
    }

    @Input('text')
    public set text(text: string) {
        this.ngtStylizableService.text = text;
    }

    @Input('breakWords')
    public set breakWords(breakWords: string) {
        this.ngtStylizableService.breakWords = breakWords;
    }

    @Input('overflow')
    public set overflow(overflow: string) {
        this.ngtStylizableService.overflow = overflow;
    }

    @Input('position')
    public set position(position: string) {
        this.ngtStylizableService.position = position;
    }

    @Input('justifyContent')
    public set justifyContent(justifyContent: string) {
        this.ngtStylizableService.justifyContent = justifyContent;
    }

    @Input('cursor')
    public set cursor(cursor: string) {
        this.ngtStylizableService.cursor = cursor;
    }

    @Input('fontCase')
    public set fontCase(fontCase: string) {
        this.ngtStylizableService.fontCase = fontCase;
    }

    public getNgtStylizableService() {
        return this.ngtStylizableService;
    }
}
