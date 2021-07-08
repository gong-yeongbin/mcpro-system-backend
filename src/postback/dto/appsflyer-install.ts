import * as moment from 'moment-timezone';

export class AppsflyerInstall {
  private _clickid: string;
  private _af_siteid: string;
  private _af_c_id: string;
  private _advertising_id: string;
  private _idfa: string;
  private _idfv: string;
  private _country_code: string;
  private _language: string;
  private _device_carrier: string;
  private _device_ip: string;
  private _install_time: string;
  private _click_time: string;

  constructor(query: any) {
    this._clickid = query.clickid;
    this._af_siteid = query.af_siteid;
    this._af_c_id = query.af_c_id;
    this._advertising_id = query.advertising_id;
    this._idfa = query.idfa;
    this._idfv = query.idfv;
    this._country_code = query.country_code;
    this._language = query.language;
    this._device_carrier = query.device_carrier;
    this._device_ip = query.device_ip;
    this._install_time = moment.utc(query.install_time).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    this._click_time = moment.utc(query.click_time).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  build() {
    return {
      clickid: this._clickid,
      af_siteid: this._af_siteid,
      af_c_id: this._af_c_id,
      advertising_id: this._advertising_id,
      idfa: this._idfa,
      idfv: this._idfv,
      country_code: this._country_code,
      language: this._language,
      device_carrier: this._device_carrier,
      device_ip: this._device_ip,
      install_time: this._install_time,
      click_time: this._click_time,
    };
  }
}
