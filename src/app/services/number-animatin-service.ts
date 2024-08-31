
// number-animation.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NumberAnimationService {
  private animationFrameId: number | null = null;

  animateNumber(
    elementId: string,
    start: number,
    end: number,
    step: number = 1
  ): Promise<void> {
    return new Promise((resolve) => {
      const element = document.getElementById(elementId);
      if (!element) {
        resolve();
        return;
      }

      let current = start;

      const update = () => {
        if (current < end) {
          current += step;
          if (current > end) current = end;
          element.textContent = current.toString();
          this.animationFrameId = requestAnimationFrame(update);
        } else {
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(update);
    });
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
