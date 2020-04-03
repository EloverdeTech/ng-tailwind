import { Directive, Input } from '@angular/core';

import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Directive({
  selector: '[ngt-stylizable]'
})
export class NgtStylizableDirective {

  private ngtStylizableService: NgtStylizableService;

  constructor() {
    this.ngtStylizableService = new NgtStylizableService();
  }

  public getNgtStylizableService() {
    return this.ngtStylizableService;
  }

  get color() {
    return this.ngtStylizableService.color;
  }

  @Input('color')
  set color(color) {
    this.ngtStylizableService.color = color;
  }

  @Input('color.text')
  set textColor(textColor: string) {
    this.ngtStylizableService.textColor = textColor;
  }

  @Input('color.bg')
  set bgColor(bgColor: string) {
    this.ngtStylizableService.bgColor = bgColor;
  }

  @Input('color.border')
  set borderColor(borderColor) {
    this.ngtStylizableService.borderColor = borderColor;
  }

  get h(): string {
    return this.ngtStylizableService.h;
  }

  @Input('h')
  set h(h: string) {
    this.ngtStylizableService.h = h;
  }

  get w(): string {
    return this.ngtStylizableService.w;
  }

  @Input('w')
  set w(w: string) {
    this.ngtStylizableService.w = w;
  }

  get p(): string {
    return this.ngtStylizableService.p;
  }

  @Input('p')
  set p(p: string) {
    this.ngtStylizableService.p = p;
  }

  get px(): string {
    return this.ngtStylizableService.px;
  }

  @Input('px')
  set px(px: string) {
    this.ngtStylizableService.px = px;
  }

  get py(): string {
    return this.ngtStylizableService.py;
  }

  @Input('py')
  set py(py: string) {
    this.ngtStylizableService.py = py;
  }

  get pt(): string {
    return this.ngtStylizableService.pt;
  }

  @Input('pt')
  set pt(pt: string) {
    this.ngtStylizableService.pt = pt;
  }

  get pr(): string {
    return this.ngtStylizableService.pr;
  }

  @Input('pr')
  set pr(pr: string) {
    this.ngtStylizableService.pr = pr;
  }

  get pb(): string {
    return this.ngtStylizableService.pb;
  }

  @Input('pb')
  set pb(pb: string) {
    this.ngtStylizableService.pb = pb;
  }

  get pl(): string {
    return this.ngtStylizableService.pl;
  }

  @Input('pl')
  set pl(pl: string) {
    this.pl = this.ngtStylizableService.pl;
  }

  get m(): string {
    return this.ngtStylizableService.m;
  }

  @Input('m')
  set m(m: string) {
    this.ngtStylizableService.m = m;
  }

  get mx(): string {
    return this.ngtStylizableService.mx;
  }

  @Input('mx')
  set mx(mx: string) {
    this.ngtStylizableService.mx = mx;
  }

  get my(): string {
    return this.ngtStylizableService.my;
  }

  @Input('my')
  set my(my: string) {
    this.ngtStylizableService.my = my;
  }

  get mt(): string {
    return this.ngtStylizableService.mt;
  }

  @Input('mt')
  set mt(mt: string) {
    this.ngtStylizableService.mt = mt;
  }

  get mr(): string {
    return this.ngtStylizableService.mr;
  }

  @Input('mr')
  set mr(mr: string) {
    this.ngtStylizableService.mr = mr;
  }

  get mb(): string {
    return this.ngtStylizableService.mb;
  }

  @Input('mb')
  set mb(mb: string) {
    this.ngtStylizableService.mb = mb;
  }

  get ml(): string {
    return this.ngtStylizableService.ml;
  }

  @Input('ml')
  set ml(ml: string) {
    this.ngtStylizableService.ml = ml;
  }

  get border(): string {
    return this.ngtStylizableService.border;
  }

  @Input('border')
  set border(border: string) {
    this.ngtStylizableService.border = border;
  }

  get shadow(): string {
    return this.ngtStylizableService.shadow;
  }

  @Input('shadow')
  set shadow(shadow: string) {
    this.ngtStylizableService.shadow = shadow;
  }
}
