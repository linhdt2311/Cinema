import { NzTableSize } from "ng-zorro-antd/table";
import { NzTabPosition } from "ng-zorro-antd/tabs";

export interface Setting {
    tabSelectedIndex: number;
    tabPosition: NzTabPosition;
    tabBarGutter: number;
    tabSize: any;
    tabType: any;
    tabHideAll: boolean;
    drawerPosition: NzTabPosition;
}