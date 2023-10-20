import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone:true
})
export class ResaltarDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = '';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }  
  
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('beige');
  }
  
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
