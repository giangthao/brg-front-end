import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appOverflowTooltip]',
})
export class OverflowTooltipDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngAfterViewInit(): void {
    this.checkOverflow();
  }

  private checkOverflow(): void {
    if (this.isTextOverflowing()) {
      this.renderer.addClass(this.el.nativeElement, 'overflowing');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'overflowing');
    }
  }

  private isTextOverflowing(): boolean {
    const element = this.el.nativeElement;
    return (
      element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight
    );
  }
}
