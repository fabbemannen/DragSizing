import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DragSizing';
  fractionsStart: number = 50;
  fractionsEnd: number = 50;
  moveSpeed: number = 0.2;
  OnMoveBound = this.OnMove.bind(this);

  async InitDrag(element: HTMLElement): Promise<void> {
    await element.requestPointerLock();
    if (document.pointerLockElement === element) {
      document.addEventListener("mousemove", this.OnMoveBound, false);
    }
    this.getLockStatus(element);
  }

  async Release(element: HTMLElement): Promise<void> {
    document.exitPointerLock();
    document.removeEventListener("mousemove", this.OnMoveBound, false);
    this.getLockStatus(element);
  }

  private getLockStatus(element: HTMLElement): boolean {
    if (document.pointerLockElement === element) {
      console.log("The pointer lock status is now locked", element);
      return true;
    } else {
      console.log("The pointer lock status is now unlocked");
      return false;
    }
  }

  async OnMove(event: MouseEvent): Promise<void> {
    const min = 0;
    const max = this.fractionsStart + this.fractionsEnd;
    this.fractionsStart += event.movementX * this.moveSpeed;
    this.fractionsEnd -= event.movementX * this.moveSpeed;
    this.fractionsStart = this.clamp(this.fractionsStart, min, max);
    this.fractionsEnd = this.clamp(this.fractionsEnd, min, max);
    console.log(`${event.movementX} | ${this.fractionsStart}/${this.fractionsEnd}`);
  }

  private clamp(number: number, min: number, max: number): number {
    return Math.max(min, Math.min(number, max));
  }
}
