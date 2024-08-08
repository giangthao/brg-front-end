import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-kpi-form',
    templateUrl: './kpi-form.component.html',
    styleUrls: ['./kpi-form.component.scss']
})
export class KPIFormComponent {
    @Input() type!: string;

    constructor(private router: Router){}

}