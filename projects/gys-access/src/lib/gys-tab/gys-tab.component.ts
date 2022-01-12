import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";

@Component({
    selector: 'gys-tab',
    templateUrl: './gys-tab.component.html',
    styleUrls: ['./gys-tab.component.scss']
})
export class GysTabComponent implements OnInit{

    @Input() 
    contentSource: any;

    @Input()
    selectedVal:string = '';

    @Output() tabEvent = new EventEmitter<string>();

    $eventBus?: Subscription;
    
    constructor(){}

    onEventHandler(e: CustomEvent) {
        //console.log('GysTabComponent onEventHandler',e);
        if(e.detail){
            const response = e.detail;
            this.handleChangeTab(response.tab);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.handleChangeTab(this.selectedVal);
    }

    async ngOnInit() {
        // console.log('GysTabComponent')
        // console.log(this.contentSource)
        // console.log(this.selectedVal);
        this.$eventBus = fromEvent<CustomEvent>(window, 'app-event-tab-change').subscribe((e) => this.onEventHandler(e));
    }

    handleChangeTab(value:any){
        //console.log('gys-tab handleChangeTab',value)
        if(value){
            //console.log(value);
            this.selectedVal = value;
            this.tabEvent.emit(value);
        }
    }

    ngOnDestroy() {
        this.$eventBus?.unsubscribe();
    }
}