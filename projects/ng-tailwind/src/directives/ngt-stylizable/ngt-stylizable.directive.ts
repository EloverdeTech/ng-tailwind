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

    public getNgtStylizableService() {
        return this.ngtStylizableService;
    }

    public get color() {
        return this.ngtStylizableService.color;
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

    public get h(): string {
        return this.ngtStylizableService.h;
    }

    @Input('h')
    public set h(h: string) {
        this.ngtStylizableService.h = h;
    }

    public get w(): string {
        return this.ngtStylizableService.w;
    }

    @Input('w')
    public set w(w: string) {
        this.ngtStylizableService.w = w;
    }

    public get p(): string {
        return this.ngtStylizableService.p;
    }

    @Input('p')
    public set p(p: string) {
        this.ngtStylizableService.p = p;
    }

    public get px(): string {
        return this.ngtStylizableService.px;
    }

    @Input('px')
    public set px(px: string) {
        this.ngtStylizableService.px = px;
    }

    public get py(): string {
        return this.ngtStylizableService.py;
    }

    @Input('py')
    public set py(py: string) {
        this.ngtStylizableService.py = py;
    }

    public get pt(): string {
        return this.ngtStylizableService.pt;
    }

    @Input('pt')
    public set pt(pt: string) {
        this.ngtStylizableService.pt = pt;
    }

    public get pr(): string {
        return this.ngtStylizableService.pr;
    }

    @Input('pr')
    public set pr(pr: string) {
        this.ngtStylizableService.pr = pr;
    }

    public get pb(): string {
        return this.ngtStylizableService.pb;
    }

    @Input('pb')
    public set pb(pb: string) {
        this.ngtStylizableService.pb = pb;
    }

    public get pl(): string {
        return this.ngtStylizableService.pl;
    }

    @Input('pl')
    public set pl(pl: string) {
        this.pl = this.ngtStylizableService.pl;
    }

    public get m(): string {
        return this.ngtStylizableService.m;
    }

    @Input('m')
    public set m(m: string) {
        this.ngtStylizableService.m = m;
    }

    public get mx(): string {
        return this.ngtStylizableService.mx;
    }

    @Input('mx')
    public set mx(mx: string) {
        this.ngtStylizableService.mx = mx;
    }

    public get my(): string {
        return this.ngtStylizableService.my;
    }

    @Input('my')
    public set my(my: string) {
        this.ngtStylizableService.my = my;
    }

    public get mt(): string {
        return this.ngtStylizableService.mt;
    }

    @Input('mt')
    public set mt(mt: string) {
        this.ngtStylizableService.mt = mt;
    }

    public get mr(): string {
        return this.ngtStylizableService.mr;
    }

    @Input('mr')
    public set mr(mr: string) {
        this.ngtStylizableService.mr = mr;
    }

    public get mb(): string {
        return this.ngtStylizableService.mb;
    }

    @Input('mb')
    public set mb(mb: string) {
        this.ngtStylizableService.mb = mb;
    }

    public get ml(): string {
        return this.ngtStylizableService.ml;
    }

    @Input('ml')
    public set ml(ml: string) {
        this.ngtStylizableService.ml = ml;
    }

    public get border(): string {
        return this.ngtStylizableService.border;
    }

    @Input('border')
    public set border(border: string) {
        this.ngtStylizableService.border = border;
    }

    public get shadow(): string {
        return this.ngtStylizableService.shadow;
    }

    @Input('shadow')
    public set shadow(shadow: string) {
        this.ngtStylizableService.shadow = shadow;
    }

    public get rounded(): string {
        return this.ngtStylizableService.rounded;
    }

    @Input('rounded')
    public set rounded(rounded: string) {
        this.ngtStylizableService.rounded = rounded;
    }

    public get font(): string {
        return this.ngtStylizableService.font;
    }

    @Input('font')
    public set font(font: string) {
        this.ngtStylizableService.font = font;
    }

    public get text(): string {
        return this.ngtStylizableService.text;
    }

    @Input('text')
    public set text(text: string) {
        this.ngtStylizableService.text = text;
    }

    public get breakWords(): string {
        return this.ngtStylizableService.breakWords;
    }

    @Input('breakWords')
    public set breakWords(breakWords: string) {
        this.ngtStylizableService.breakWords = breakWords;
    }

    public get overflow(): string {
        return this.ngtStylizableService.overflow;
    }

    @Input('overflow')
    public set overflow(overflow: string) {
        this.ngtStylizableService.overflow = overflow;
    }
}
