import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[tooltipIfOverflow]',
  providers: [MatTooltip],
})
export class TooltipIfOverflowDirective implements AfterViewInit {
  @Input('tooltipIfOverflow') tooltipText = '';

  constructor(
    private el: ElementRef<HTMLElement>,
    private tooltip: MatTooltip,
    private renderer: Renderer2
  ) {
    this.tooltip.position = 'above';
  }

  ngAfterViewInit() {
    this.updateTooltip();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateTooltip();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.updateTooltip();
    if (this.tooltip.message) {
      this.tooltip.show();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.tooltip.hide();
  }

  private updateTooltip() {
    const element = this.el.nativeElement;
    const isOverflowing = element.scrollWidth > element.clientWidth;

    if (isOverflowing) {
      this.tooltip.message = this.tooltipText;
      this.renderer.setStyle(element, 'cursor', 'help');
      this.tooltip.disabled = false;
    } else {
      this.tooltip.message = '';
      this.tooltip.hide();
      this.tooltip.disabled = true;
      this.renderer.removeStyle(element, 'cursor');
    }
  }
}
