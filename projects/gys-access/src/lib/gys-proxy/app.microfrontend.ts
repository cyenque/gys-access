import { LoadRemoteModuleOptions } from "@angular-architects/module-federation";

export interface IMicrofrontend {
    id:             string;
    caption?:       string;
    type:           string;
    remoteName:     string;
    name:           string;
    componentName:  string;
    col:            string;
    hidden:         boolean;
    options:       IRemoteOption;
}

export interface IContent {
    id:         string;
    name:       string;
    title:      string;
    subTitle:   string;
    items?:     IMicrofrontend[];
}

export interface IModule {
    id:   number;
    name: string;
    url:  string;
    visible: boolean;
    contentDefault?: string;
    contents?: IContent[]
}


export type IRemoteOption = LoadRemoteModuleOptions & {
    displayName:    string;
    routePath:      string;
    ngModuleName:   string;
    componentName:  string;
    ngName:         string;
}
