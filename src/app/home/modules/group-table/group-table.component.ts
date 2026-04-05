import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  mockData,
  GroupData,
  DeliveryInforChild,
  GROUP_COLUMNS,
  SUB_COLUMNS,
} from './group-table.default';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
          visibility: 'hidden',
          opacity: 0,
        }),
      ),
      state(
        'expanded',
        style({ height: '*', visibility: 'visible', opacity: 1 }),
      ),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ],
})
export class GroupTableComponent implements OnInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  isScrolled = false;
  rows: GroupData[] = [];
  isLoading = false;
  groupColumns = GROUP_COLUMNS;
  subColumns = SUB_COLUMNS;

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.rows = mockData;
  }

  toggleAllGroups(): void {
    if (this.isLoading) return;
    const targetState = !this.isAllExpanded;
    this.rows.forEach((g) => (g.expanded = targetState));
  }

  toggleGroup(group: GroupData): void {
    group.expanded = !group.expanded;
  }

  onClickMasterCheckbox(event: any): void {
    const isChecked = event.target.checked;
    this.rows.forEach((group) => {
      group.checked = isChecked;
      group.indeterminate = false;
      group.children.forEach((child) => (child.checked = isChecked));
    });
  }

  onClickCheckboxGroup(group: GroupData, event: any): void {
    const isChecked = event.target.checked;
    group.checked = isChecked;
    group.indeterminate = false;

    if (group.children) {
      group.children.forEach((child) => (child.checked = isChecked));
    }
  }

  onClickCheckboxChild(
    child: DeliveryInforChild,
    parentId: string,
    event: any,
  ): void {
    child.checked = event.target.checked;

    const group = this.rows.find((g) => g.parent.id === parentId);
    if (group) {
      const total = group.children.length;
      const checked = group.children.filter((c) => c.checked).length;

      group.checked = checked === total;
      group.indeterminate = checked > 0 && checked < total;
    }
  }

  @HostListener('scroll', ['$event'])
  onElementScroll(event: any) {
    this.isScrolled = event.target.scrollTop > 0;
  }

  get totalSelected(): number {
    let count = 0;
    this.rows.forEach((group) => {
      count += group.children.filter((child) => child.checked).length;
    });
    return count;
  }

  get isAllSelected(): boolean {
    if (!this.rows || this.rows.length === 0) return false;
    return this.rows.every(
      (group) => group.checked && group.children.every((c) => c.checked),
    );
  }

  get isMasterIndeterminate(): boolean {
    if (!this.rows || this.rows.length === 0) return false;
    const hasSomeSelected = this.rows.some(
      (group) =>
        group.checked ||
        group.indeterminate ||
        group.children.some((c) => c.checked),
    );
    return hasSomeSelected && !this.isAllSelected;
  }

  get isAllExpanded(): boolean {
    return this.rows.length > 0 && this.rows.every((g) => g.expanded);
  }
}
