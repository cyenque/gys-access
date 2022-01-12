import { Component, Input, OnChanges, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type, Compiler, ChangeDetectorRef } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { IMicrofrontend } from './app.microfrontend';


@Component({
    selector: 'gys-proxy',
    template: `
        <ng-container #placeHolder></ng-container>
    `
})
export class PluginProxyComponent implements OnChanges {
    @ViewChild('placeHolder', { read: ViewContainerRef, static: true })
    viewContainer: ViewContainerRef;

    constructor(
        private injector: Injector,
        private cfr: ComponentFactoryResolver,
        private compiler: Compiler,
        private cdRef: ChangeDetectorRef
       
    ) { }
  

    @Input()
    item: IMicrofrontend;  

    async ngOnChanges() {
        this.viewContainer.clear();
        if (this.item) {
            let options = this.item.options;
            const module = await loadRemoteModule(options)
                .then(m => m[options.ngName]);
            await this.compileModule(module);
        }
        
    }

    compileModule = (module: any) => {
        //console.log(module);
        return new Promise<void>(
            (resolve) => {
                this.compiler.compileModuleAndAllComponentsAsync(module)
                    .then((compiled) => {
                        let components = compiled.componentFactories;
                        //console.log('componentes del modulo',components)
                        components.forEach(comp => {
                            const type = Object.getOwnPropertyDescriptors(comp.componentType);
                            if (type.name.value == this.item.componentName) {
                                // console.log('componente tipo match',type);
                                // console.log('componente valor match',type.name.value);
                                // console.log('componente nombre match',this.item.componentName);
                                // console.log('componente match',comp);
                                // Ivy --> ViewEngine
                                //let moduleRef = compiled.ngModuleFactory.create(this.injector);
                                const factory = this.cfr.resolveComponentFactory(comp.componentType);
                                //console.log('factory',factory);
                                const compRef = this.viewContainer.createComponent(factory, null, this.injector);
                                compRef.instance.a = 'test'
                                this.cdRef.detectChanges();
                                resolve();
                            }
                        })
                    });
            }
        );
    }

    // async prepareEvents(){
    //     return new Promise<void>( 
    //         async (resolve)=>{
    //             const { cabecera, tabulador } = this.item;
    //             let promises: any[] = [];
    //             if(cabecera) {
    //                 const action0 = await this.sendEvent('cabecera', 'app-event-cabecera', cabecera);
    //                 promises.push(action0);
    //             }

    //             if (tabulador){
    //                 const action1 = await this.sendEvent('tabulador', 'app-event-tabulador', tabulador);
    //                 promises.push(action1);
    //             }
    //             await Promise.all(promises).then(() => {
    //                 resolve();
    //             });
    //         }
    //     );
    // }


    // sendEvent = (origen:string, nameEvent:string, data:any) =>{
    //     console.log(origen);
    //     return new Promise<void>(
    //         (resolve)=>{

    //             const busEvent = new CustomEvent(nameEvent, {
    //                 bubbles: true,
    //                 //cancelable: true,
    //                 detail: data
    //             });
    //             console.log(busEvent);
    //             dispatchEvent(busEvent);
    //             //console.log(dis);
    //             resolve();
    //         }
    //     );
    // }
}

