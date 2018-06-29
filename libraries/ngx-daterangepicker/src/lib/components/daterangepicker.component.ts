import { Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterContentChecked,
  AfterViewChecked,
  EventEmitter,
  Input,
  Output,
  OnChanges
} from '@angular/core';
import * as momentNs from 'moment';
const moment = momentNs;

@Component({
  selector: 'lib-daterangepicker',
  templateUrl: './daterangepicker.component.html',
  styleUrls: ['./daterangepicker.component.scss']
})
export class DaterangepickerComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {
  show: boolean;
  menuTop: any;
  menuLeft: any;
  dateStr: string;
  title: string;
  activeItem = 'Today';
  showCalendar: boolean;
  trigger: boolean;

  // Input attributes
  @Input() opens = 'left';
  @Input() start: momentNs.Moment;
  @Input() end: momentNs.Moment;
  @Input() outputFormat;
  @Input() format = 'MM/DD/YYYY';
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() pill: false;
  @Input() ranges: any;

  // End of Input attributes
  @Output() startChange = new EventEmitter();
  @Output() endChange = new EventEmitter();
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() complete: EventEmitter<any> = new EventEmitter();
  @ViewChild('cEl') cEl: ElementRef;
  @ViewChild('pickerElement') el: ElementRef;
  constructor() {
    this.show = false;
    this.showCalendar = false;
    // this.menuTop = this.el.nativeElement.offsetTop;
    // this.menuLeft = this.el.nativeElement.offsetLeft;
  }

  ngOnInit() {
    if (typeof this.ranges === 'undefined') {
      this.ranges = [
        {
          text: 'Today', desc: 'Today', value: 'today',
          start: moment(),
          end: moment(),
          default: true
        },
        {
          text: 'Yesterday', desc: 'Yesterday', value: 'yesterday',
          start: moment().subtract(1, 'days'),
          end: moment().subtract(1, 'days'),
        },
        {
          text: 'Last 7 Days', desc: 'Last 7 Days', value: 'last7days',
          start: moment().subtract(6, 'days'),
          end: moment().subtract(1, 'days')
        },
        {
          text: 'Last 30 Days', desc: 'Last 30 Days', value: 'last30days',
          start: moment().subtract(29, 'days'),
          end: moment()
        },
        {
          text: 'This Month', desc: 'This Month', value: 'thismonth',
          start: moment().startOf('month'),
          end: moment().endOf('month')
        },
        {
          text: 'Last Month', desc: 'Last Month', value: 'lastmonth',
          start: moment().subtract(1, 'month').startOf('month'),
          end: moment().subtract(1, 'month').endOf('month')
        }
      ];
    }

    if (typeof this.pill !== 'boolean') {
      this.pill = false;
    }
    if (typeof this.start === 'string') {
      this.start = moment(this.start, this.format);
    }

    if (typeof this.end === 'string') {
      this.end = moment(this.end, this.format);
    }

    if (typeof this.start === 'undefined') {
      this.start = moment();
    }
    if (typeof this.end === 'undefined') {
      this.start = moment();
    }

    if (typeof this.minDate === 'string' ) {
      this.minDate = moment(this.minDate, this.format);
    }

    if (typeof this.maxDate === 'string') {
      this.maxDate = moment(this.maxDate, this.format);
    }

    if (typeof this.minDate === 'object') {
      this.minDate = moment(this.minDate);
    }
    if (typeof this.maxDate === 'object') {
      this.maxDate = moment(this.maxDate);
    }

    if (!this.outputFormat && !this.pill) {
      this.outputFormat = 'YYYY-MM-DD';
    } else {
      this.outputFormat = 'MMM D';
    }
  }

  setCurrent() {

    if (this.ranges) {
      this.selectRange(this.ranges[0]);
    } else {
      this.start = moment();
      this.end = moment();
      this.renderText(this.start, this.end);
      this.emitResult();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setCurrent();
    }, 0);
  }

  ngAfterViewChecked() {}

  toggleMenu() {
    setTimeout(() => {
    this.menuTop = this.el.nativeElement.offsetTop + 50;
    this.menuLeft = this.el.nativeElement.offsetLeft;
    this.show = !this.show;
    if (this.ranges && this.showCalendar) {
      this.menuLeft += 556;
      this.showCalendar = !this.showCalendar;
    } else if (!this.ranges) {
      this.showCalendar = true;
    }

    }, 0);
  }
  renderText(start: momentNs.Moment, end: momentNs.Moment) {
    if (start && end) {
      const period = +end - +start;
      const diff = +moment() - +start;
      setTimeout(() => {
        if (period < 100 && diff < 86400000) {
          this.title = 'Today: ';
          this.dateStr = this.start.format(this.outputFormat);
        } else if (period < 100 && diff >= 86400000) {
          this.title = 'Yesterday: ';
          this.dateStr = this.start.format(this.outputFormat);
        } else {
          this.title = '';
          this.dateStr = start.format(this.outputFormat) + ' - ' + end.format(this.outputFormat);
        }
      }, 0);
    }
  }

  selectRange(range: any) {
    if (range) {
      this.activeItem = range.text;
      this.start = range.start;
      this.end = range.end;

      this.renderText(this.start, this.end);
      this.emitResult();
    }
  }

  triggerCalendar() {
    this.activeItem = 'Custom Range';
    setTimeout(() => {
      if (this.showCalendar && this.opens === 'left') {
        this.menuLeft += 556;
      } else if (this.opens === 'left') {
        this.menuLeft -= 556;
      }
      this.showCalendar = !this.showCalendar;
    }, 0);
  }

  apply() {
    this.trigger = !this.trigger;
    this.toggleMenu();
  }

  closeMenu() {
    setTimeout(() => {
      this.show = false;
    }, 0);
  }
  detected(event: any) {
    this.start = event.start;
    this.end = event.end;
    this.emitResult();
    this.renderText(this.start, this.end);
    this.closeMenu();
    // console.log(event);
  }

  emitResult() {
    setTimeout(() => {

      if (this.start && this.end) {
        this.startChange.emit(this.start); // this is to calendar
        this.endChange.emit(this.end); // this is to calendar
        this.complete.emit({ start: this.start.format(this.outputFormat), end: this.end.format(this.outputFormat)});
      }
    }, 0);
  }

  ngOnChanges(changes: any) {
    // console.log(changes);
  }
}
