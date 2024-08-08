import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements OnInit {
  @Input() label!: string;
  @Input() required?: boolean;
  @Input() placeholder!: string;
  @Input() formControlName!: string;
  @Input() options!: { value: string; label: string }[];
  @Input() filteredOptions! : { value: string; label: string }[];
  @Output() onOpen: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('inputElement') inputElement!: ElementRef;
  @Output() onSearchable : EventEmitter<string> = new EventEmitter();

  optionsVivibility: boolean = false;
  showOptionOnBelow: boolean = true;
  value: string = '';

  formGroup: FormGroup;

  constructor(private renderer: Renderer2) {
    this.formGroup = new FormGroup({
        searchValue: new FormControl('')
    })
  }

  ngOnInit(): void {
    if (!this.required) {
      this.required = false;
    }
    this.formGroup.valueChanges.subscribe((value) => {
        console.log(value)
    })
  }

  handlerClickOutside() {
    this.optionsVivibility = false;
    if (!this.checkValueInputExistedInOptions(this.value)) {
      this.value = '';
      this.onChange('')
    }
  }

  toggleShowOptions(event: any) {
    
    this.optionsVivibility =  !this.optionsVivibility;

    if (this.optionsVivibility) {
      this.onOpen.emit(true);
      const elemnt = event.target as HTMLElement;
      const heightToTop = elemnt.getBoundingClientRect().top;
      const heightToBottom = window.innerHeight - heightToTop;
      console.log('top: ', heightToTop),
      console.log('bottom: ', heightToBottom);
    }
    else{
        this.handlerClickOutside()
    }
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Optional: Handle disabled state if necessary
  }

  onOptionSelect(value: string, event: Event): void {
    event.stopImmediatePropagation()
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

//   filterOptions(value?: string): void {
//     if (!value) {
//       this.filteredOptions = this.options;
//     } else {
//       this.filteredOptions = this.options.filter((option) =>
//         option.label.toLowerCase().includes(value.toLowerCase())
//       );
//     }
//   }

  checkValueInputExistedInOptions(value: any) {
    const existedItem = this.options.find((item) => item.value === value);
    return !!existedItem;
  }

  clearValue(event: Event) {
    event.stopImmediatePropagation();
    this.value = '';
    this.onChange(this.value);
    this.formGroup.patchValue({
        searchValue: ''
    });
  }

}
