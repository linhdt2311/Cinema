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
      this.setting.drawerPosition = 'right';
      this.setting.paginationPosition = 'bottom';
      this.setting.paginationSimple = false;
      this.setting.paginationType = 'default';
    } else {
      this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    }
  }

  changeSelectTabDefault(ev: any){
    this.setting.tabSelectedIndex = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changePositionTab(ev: any){
    this.setting.tabPosition = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changeTabBarGutter(ev: any){
    this.setting.tabBarGutter = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changeTabSize(ev: any){
    this.setting.tabSize = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changeTabType(ev: any){
    this.setting.tabType = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changeHideAll(ev: any){
    this.setting.tabHideAll = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changePositionDrawer(ev: any){
    this.setting.drawerPosition = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changePositionPagination(ev: any){
    this.setting.paginationPosition = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changePaginationSimple(ev: any){
    this.setting.paginationSimple = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }

  changePaginationType(ev: any){
    this.setting.paginationType = ev;
    return localStorage.setItem('setting', JSON.stringify(this.setting));
  }
}
