import { Component, OnInit } from '@angular/core';
import { Setting } from 'src/app/models/setting';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  checkSetting: boolean = true;
  setting: Setting
  constructor() { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.checkSetting = Object.keys(this.setting).length === 0;
    if(this.checkSetting == true){
      this.setting.tabSelectedIndex = 0;
      this.setting.tabPosition = 'top';
      this.setting.tabBarGutter = 0;
      this.setting.tabSize = 'default';
      this.setting.tabType = 'line';
      this.setting.tabHideAll = false;
    } else {
      this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    }
  }

  onChangeSelectTabDefault(ev: any){
    this.setting.tabSelectedIndex = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  onChangePositionTab(ev: any){
    this.setting.tabPosition = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  onChangeTabBarGutter(ev: any){
    this.setting.tabBarGutter = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  onChangeTabSize(ev: any){
    this.setting.tabSize = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  onChangeTabType(ev: any){
    this.setting.tabType = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  onChangeHideAll(ev: any){
    this.setting.tabHideAll = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  onChangePositionDrawer(ev: any){
    this.setting.drawerPosition = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }
}
