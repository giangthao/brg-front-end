import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subject, throwError, timer } from 'rxjs';
import { catchError, mergeMap, switchMap, takeUntil, tap, timeout } from 'rxjs/operators';

@Component({
    selector: 'app-antena-control',
    templateUrl: './antena-control.component.html',
    styleUrls: ['./antena-control.component.scss'],
})
export class AntenaControlComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('viewerCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    formGroup: FormGroup;
    currentAngle = 45;
    beamwidth = 60;
    isDragging = false;

    isLoading = false;
    pendingAngle: number | null = null;
    lastStableAngle = this.currentAngle;

    private startMouseAngle = 0;
    private startAngle = 0;
    private ctx!: CanvasRenderingContext2D;
    private animationFrameId: number | null = null;
    private animating = false;
    private spinnerAngle = 0;
    private spinnerFrameId: number | null = null;

    private readonly rotateAction$ = new Subject<number>();
    private readonly destroy$ = new Subject<void>();

    private readonly step = 28;
    private readonly radius = 140;
    private readonly outerInnerRadius = this.radius - 12;
    private readonly innerR1 = 148;
    private readonly innerR2 = this.innerR1 - this.step;
    private readonly innerR3 = this.innerR2 - this.step;
    private readonly innerR4 = this.innerR3 - this.step;
    private readonly innerR5 = this.innerR4 - this.step;
    private readonly rings = [this.innerR1, this.innerR2, this.innerR3, this.innerR4, this.innerR5];
    private readonly bigMarks = [0, 90, 180, 270];

    constructor() {
        this.formGroup = new FormGroup({
            isAutoMode: new FormControl(false),
            rotateAngle: new FormControl('15'),
            speed: new FormControl('40'),
        });
    }

    ngOnInit(): void {
        this.initRotateAction();
    }

    ngAfterViewInit(): void {
        this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
        this.draw();

        const canvas = this.canvasRef.nativeElement;

        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvas.addEventListener('mouseup', () => this.onMouseUp());
        canvas.addEventListener('mouseleave', () => this.onMouseUp());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.stopSpinner();
    }

    initRotateAction(): void {
        this.rotateAction$
            .pipe(
                takeUntil(this.destroy$),
                tap((targetAngle: any) => {
                    this.isLoading = true;
                    this.startSpinner();
                    this.pendingAngle = targetAngle;
                    this.lastStableAngle = this.currentAngle;
                    this.draw();
                }),

                switchMap((targetAngle: any) =>
                    this.fakeApiRotate$(targetAngle).pipe(
                        switchMap(() =>
                            this.fakeSocket$(targetAngle).pipe(
                                timeout(3000)
                            )
                        ),

                        // ===== SUCCESS =====
                        tap((confirmedAngle) => {
                            this.currentAngle = confirmedAngle;
                        }),

                        // ===== ERROR (API or SOCKET) =====
                        catchError((err) => {
                            console.log('ERROR:', err);

                            // rollback
                            this.currentAngle = this.lastStableAngle;

                            return of(null);
                        })
                    )
                ),

                // ===== FINALIZE UI =====
                tap(() => {
                    this.isLoading = false;
                    this.startSpinner();
                    this.pendingAngle = null;
                    this.draw();
                })
            )
            .subscribe();
    }

    drawTrapezoidMarker(cx: number, cy: number, radius: number, angleDeg: number): void {
        const ctx = this.ctx;

        const angle = (angleDeg - 90) * Math.PI / 180;

        // centripetal vector
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);

        // tangent vector
        const tx = -ny;
        const ty = nx;

        const ringWidth = 2; // lineWidth 

        const outerOffset = -ringWidth / 2;   // close to the inner edge
        const innerOffset = -6;              // penetrate deep inside

        const halfWidthOuter = 18; //large base (circle attachment)
        const halfWidthInner = 12;  // smaller base

        // ===== 4 point of trapezoid =====
        const rOuter = radius + outerOffset;
        const rInner = radius + innerOffset;

        const p1 = {
            x: cx + nx * rInner + tx * halfWidthInner,
            y: cy + ny * rInner + ty * halfWidthInner
        };

        const p2 = {
            x: cx + nx * rInner - tx * halfWidthInner,
            y: cy + ny * rInner - ty * halfWidthInner
        };

        const p3 = {
            x: cx + nx * rOuter - tx * halfWidthOuter,
            y: cy + ny * rOuter - ty * halfWidthOuter
        };

        const p4 = {
            x: cx + nx * rOuter + tx * halfWidthOuter,
            y: cy + ny * rOuter + ty * halfWidthOuter
        };

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        // gradient 
        const grad = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
        grad.addColorStop(0, "#7df9ff");
        grad.addColorStop(1, "#00c8ff");

        ctx.fillStyle = grad;
        ctx.fill();
    }

    draw(): void {
        const canvas = this.canvasRef.nativeElement;
        const ctx = this.ctx;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ===== GLOW STYLE =====
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 0; // 10

        // ===== OUTER RING =====
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#7df9ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // ===== INNER OUTER RING =====
        ctx.beginPath();
        ctx.arc(cx, cy, this.outerInnerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(125,249,255,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // ===== INNER RINGS =====
        ctx.shadowBlur = 0;

        this.rings.forEach((r) => {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(64,64,64,1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // ===== TICK nhỏ =====
        for (let i = 0; i < 360; i += 5) {
            const rad = (i - 90) * Math.PI / 180;

            const isMain = i % 90 === 0;

            const tickOuter = this.radius;
            const tickInner = this.radius - (isMain ? 12 : 6);

            const x1 = cx + Math.cos(rad) * tickInner;
            const y1 = cy + Math.sin(rad) * tickInner;

            const x2 = cx + Math.cos(rad) * tickOuter;
            const y2 = cy + Math.sin(rad) * tickOuter;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            ctx.strokeStyle = isMain ? '#7df9ff' : 'rgba(255,255,255,0.2)';
            ctx.lineWidth = isMain ? 2 : 1;
            ctx.stroke();
        }

        // ===== MARKER 4 HƯỚNG (răng cưa) =====
        this.bigMarks.forEach(deg => {
            this.drawTrapezoidMarker(cx, cy, this.radius, deg);
        });

        // ===== TEXT 0-90-180-270 =====
        const labelRadius = this.radius + 16;

        this.bigMarks.forEach((deg) => {
            const rad = (deg - 90) * Math.PI / 180;

            const x = cx + Math.cos(rad) * labelRadius;
            const y = cy + Math.sin(rad) * labelRadius;

            ctx.save();
            ctx.translate(x, y);

            if (deg === 90) {
                ctx.rotate(Math.PI / 2);
            }

            if (deg === 270) {
                ctx.rotate(-Math.PI / 2);
            }

            ctx.fillStyle = '#bffcff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(deg.toString(), 0, 0);

            ctx.restore();
        });

        // ===== CROSS LINE =====
        const startR = this.innerR2;       // bắt đầu từ inner ring
        const endR = this.innerR5;     // kết thúc giữa

        this.bigMarks.forEach(deg => {
            const rad = (deg - 90) * Math.PI / 180;

            ctx.beginPath();
            ctx.moveTo(
                cx + Math.cos(rad) * startR,
                cy + Math.sin(rad) * startR
            );
            ctx.lineTo(
                cx + Math.cos(rad) * endR,
                cy + Math.sin(rad) * endR
            );
            ctx.strokeStyle = 'rgba(125,249,255,0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        if (!this.isLoading) {
            // ===== SECTOR GRADIENT =====
            const start = ((this.currentAngle - this.beamwidth / 2 - 90) * Math.PI) / 180;
            const end = ((this.currentAngle + this.beamwidth / 2 - 90) * Math.PI) / 180;

            const innerR = this.innerR5;
            const outerR = this.radius;

            const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
            grad.addColorStop(0, 'rgba(0,255,200,0.75)');
            grad.addColorStop(0.6, 'rgba(0,255,200,0.15)');
            grad.addColorStop(1, 'rgba(0,255,200,0)');

            ctx.beginPath();

            // cung ngoài
            ctx.arc(cx, cy, outerR, start, end);

            // nối vào cung trong
            ctx.lineTo(
                cx + Math.cos(end) * innerR,
                cy + Math.sin(end) * innerR
            );

            // cung trong (đi ngược lại)
            ctx.arc(cx, cy, innerR, end, start, true);

            // đóng shape
            ctx.closePath();

            ctx.fillStyle = grad;
            ctx.fill();
        }

        // ===== EDGE LINE SECTOR =====
        // ctx.beginPath();
        // ctx.arc(cx, cy, radius - 5, start, end);
        // ctx.strokeStyle = '#00ffd5';
        // ctx.lineWidth = 2;
        // ctx.stroke();

        // ===== KIM =====
        const rad = (this.currentAngle - 90) * Math.PI / 180;
        const needleStartR = this.innerR5; // bắt đầu từ vòng nhỏ nhất

        const needleEndR = (this.radius + this.outerInnerRadius) / 2; // nằm giữa 2 vòng sáng

        const startX = cx + Math.cos(rad) * needleStartR;
        const startY = cy + Math.sin(rad) * needleStartR;

        const endX = cx + Math.cos(rad) * needleEndR;
        const endY = cy + Math.sin(rad) * needleEndR;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#00ffd5';
        ctx.lineWidth = 2;
        ctx.stroke();

        // ===== TEXT CENTER =====
        if (this.isLoading) {
            this.drawSpinner(cx, cy);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.font = '28px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(Math.round(this.currentAngle) + '°', cx, cy);
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (this.isLoading || this.animating) return;
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - cx;
        const dy = y - cy;

        const dist = Math.sqrt(dx * dx + dy * dy);

        // cursor
        if (dist <= this.radius && dist >= this.innerR5) {
            canvas.style.cursor = this.isDragging ? 'grabbing' : 'grab';
        } else {
            canvas.style.cursor = 'default';
        }

        if (!this.isDragging) return;
        if (dist > this.radius || dist < this.innerR5) return;

        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        angle = angle + 90;
        if (angle < 0) angle += 360;

        let delta = angle - this.startMouseAngle;

        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        this.currentAngle = (this.startAngle + delta + 360) % 360;
        this.formGroup.get('rotateAngle')?.setValue(
            Math.round(this.currentAngle),
            { emitEvent: false }
        );

        this.draw();
    }

    onMouseDown(e: MouseEvent): void {
        if (this.isLoading || this.animating) return;
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - cx;
        const dy = y - cy;

        const dist = Math.sqrt(dx * dx + dy * dy);

        const radius = 140;
        const inner5 = 36;

        if (dist > radius || dist < inner5) return;

        // save start angle
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        angle = angle + 90;
        if (angle < 0) angle += 360;

        this.startMouseAngle = angle;

        // save current angle
        this.startAngle = this.currentAngle;

        this.isDragging = true;
    }

    onMouseUp(): void {
        if (this.isLoading || this.animating) return;
        this.isDragging = false;
        this.canvasRef.nativeElement.style.cursor = 'grab';

        const target = Math.round(this.currentAngle);
        if (this.isSameAngle(target, this.lastStableAngle)) return;

        this.rotateAction$.next(target);
    }

    // ====== VALIDATE ======
    getInputAngle(): number {
        let val = Number(this.formGroup.get('rotateAngle')?.value);

        if (Number.isNaN(val)) val = 0;
        if (val < 1) val = 1;
        if (val > 360) val = 360;

        return val;
    }

    // ====== SPINNER ======
    drawSpinner(cx: number, cy: number): void {
        const ctx = this.ctx;

        const radius = 22;
        const sweep = 270;

        const start = (this.spinnerAngle - 90) * Math.PI / 180;
        const end = (this.spinnerAngle + sweep - 90) * Math.PI / 180;

        ctx.save();

        ctx.beginPath();
        ctx.arc(cx, cy, radius, start, end);

        ctx.strokeStyle = '#888';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.restore();
    }

    startSpinner(): void {
        if (this.spinnerFrameId) return;
        const animate = () => {
            this.spinnerAngle = (this.spinnerAngle + 6) % 360;
            this.draw();
            this.spinnerFrameId = requestAnimationFrame(animate);
        };
        this.spinnerFrameId = requestAnimationFrame(animate);
    }

    stopSpinner(): void {
        if (this.spinnerFrameId) {
            cancelAnimationFrame(this.spinnerFrameId);
            this.spinnerFrameId = null;
        }
    }

    // ====== ACTION ======
    rotateRight(): void {
        const input = this.getInputAngle();
        const target = this.getDirectionalTarget(input, true);
        if (this.isSameAngle(target, this.currentAngle)) {
            return;
        }
        this.animateRotate(target, true);
        this.rotateAction$.next(target);
    }

    rotateLeft(): void {
        const input = this.getInputAngle();
        const target = this.getDirectionalTarget(input, false);
        if (this.isSameAngle(target, this.currentAngle)) {
            return;
        }
        this.animateRotate(target, false);
        this.rotateAction$.next(target);
    }

    isSameAngle(a: number, b: number): boolean {
        const na = Math.round((a + 360) % 360);
        const nb = Math.round((b + 360) % 360);
        return na === nb;
    }

    getDirectionalTarget(target: number, isRight: boolean): number {
        const current = this.currentAngle;
        let delta = target - current;
        if (isRight) {
            if (delta < 0) delta += 360;
        } else {
            if (delta > 0) delta -= 360;
        }

        return (current + delta + 360) % 360;
    }

    animateRotate(target: number, isRight: boolean): void {
        if (this.animating) {
            cancelAnimationFrame(this.animationFrameId!);
        }
        this.animating = true;
        let current = this.currentAngle;
        // tính delta theo hướng
        let delta = target - current;
        if (isRight) {
            if (delta < 0) delta += 360;
        } else {
            if (delta > 0) delta -= 360;
        }

        const duration = 500; // ms
        const startTime = performance.now();

        const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);

            // easeOut 
            const ease = 1 - Math.pow(1 - progress, 3);
            const angle = current + delta * ease;
            this.currentAngle = (angle + 360) % 360;
            this.draw();
            if (progress < 1) {
                this.animationFrameId = requestAnimationFrame(step);
            } else {
                this.currentAngle = target;
                this.animating = false;
                this.draw();
            }
        };

        this.animationFrameId = requestAnimationFrame(step);
    }

    fakeApiRotate$(angle: number): Observable<any> {
        return timer(800).pipe(
            mergeMap(() => {
                // const success = Math.random() > 0.3;
                const success = true;
                console.log("angle", angle);
                console.log("call api success? : ", success)
                return success ? of(angle) : throwError(() => 'api-error');
            })
        );
    }

    fakeSocket$(angle: number): Observable<any> {
        const delayTime = Math.random() * 3000;

        return timer(delayTime).pipe(
            mergeMap(() => {
                // const success = Math.random() > 0.2;
                const success = false;
                console.log("angle", angle);
                console.log("socket success? : ", success)
                return success ? of(angle) : throwError(() => 'socket-error');
            })
        );
    }

    get isAutoMode(): boolean {
        return this.formGroup.get('isAutoMode')?.value === true;
    }
}
