import * as moment from 'moment-timezone';

export class AdbrixremasterEvent {
  private _a_key: string;
  private _a_cookie: string;
  private _a_ip: string;
  private _a_fp: string;
  private _a_country: string;
  private _a_city: string;
  private _a_region: string;
  private _a_appkey: string;
  private _m_publisher: string;
  private _m_sub_publisher: string;
  private _attr_adid: string;
  private _attr_event_datetime: string;
  private _attr_event_timestamp: string;
  private _attr_seconds_gap: string;
  private _adid: string;
  private _idfv: string;
  private _ad_id_opt_out: string;
  private _device_os_version: string;
  private _device_model: string;
  private _device_vendor: string;
  private _device_resolution: string;
  private _device_portrait: string;
  private _device_platform: string;
  private _device_network: string;
  private _device_wifi: string;
  private _device_carrier: string;
  private _device_language: string;
  private _device_country: string;
  private _device_build_id: string;
  private _package_name: string;
  private _appkey: string;
  private _sdk_version: string;
  private _installer: string;
  private _app_version: string;
  private _event_name: string;
  private _event_datetime: string;
  private _event_timestamp: string;
  private _event_timestamp_d: string;
  private _param_json: string;
  private _cb_1: string;
  private _cb_2: string;
  private _cb_3: string;
  private _cb_4: string;
  private _cb_5: string;
  private _product_id: string;
  private _currency: string;
  private _price: number;

  constructor(query: any) {
    this._a_key = query.a_key;
    this._a_cookie = query.a_cookie;
    this._a_ip = query.a_ip;
    this._a_fp = query.a_fp;
    this._a_country = query.a_country;
    this._a_city = query.a_city;
    this._a_region = query.a_region;
    this._a_appkey = query.a_appkey;
    this._m_publisher = query.m_publisher;
    this._m_sub_publisher = query.m_sub_publisher;
    this._attr_adid = query.attr_adid;
    this._attr_event_datetime = moment.utc(query.attr_event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    this._attr_event_timestamp = query.attr_event_timestamp;
    this._attr_seconds_gap = query.attr_seconds_gap;
    this._adid = query.adid;
    this._idfv = query.idfv;
    this._ad_id_opt_out = query.ad_id_opt_out;
    this._device_os_version = query.device_os_version;
    this._device_model = query.device_model;
    this._device_vendor = query.device_vendor;
    this._device_resolution = query.device_resolution;
    this._device_portrait = query.device_portrait;
    this._device_platform = query.device_platform;
    this._device_network = query.device_network;
    this._device_wifi = query.device_wifi;
    this._device_carrier = query.device_carrier;
    this._device_language = query.device_language;
    this._device_country = query.device_country;
    this._device_build_id = query.device_build_id;
    this._package_name = query.package_name;
    this._appkey = query.appkey;
    this._sdk_version = query.sdk_version;
    this._installer = query.installer;
    this._app_version = query.app_version;
    this._event_name = query.event_name;
    this._event_datetime = moment.utc(query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    this._event_timestamp = query.event_timestamp;
    this._event_timestamp_d = query.event_timestamp_d;
    this._cb_1 = query.cb_1;
    this._cb_2 = query.cb_2;
    this._cb_3 = query.cb_3;
    this._cb_4 = query.cb_4;
    this._cb_5 = query.cb_5;
    this._param_json = query.param_json ? JSON.parse(query.param_json) : '';

    if (this._param_json['abx:item.abx:sales']) {
      this._product_id = this._param_json['abx:item.abx:product_id'];
      this._price = +this._param_json['abx:item.abx:sales'];
      this._currency = this._param_json['abx:item.abx:currency'];
    } else if (this._param_json['abx:items']) {
      this._price = 0;

      for (const item of this._param_json['abx:items']) {
        this._price += +item['abx:sales'];
        this._product_id = item['abx:product_id'];
        this._currency = item['abx:currency'];
      }
    }
  }

  build() {
    return {
      a_key: this._a_key,
      a_cookie: this._a_cookie,
      a_ip: this._a_ip,
      a_fp: this._a_fp,
      a_country: this._a_country,
      a_city: this._a_city,
      a_region: this._a_region,
      a_appkey: this._a_appkey,
      m_publisher: this._m_publisher,
      m_sub_publisher: this._m_sub_publisher,
      attr_adid: this._attr_adid,
      attr_event_datetime: this._attr_event_datetime,
      attr_event_timestamp: this._attr_event_timestamp,
      attr_seconds_gap: this._attr_seconds_gap,
      adid: this._adid,
      idfv: this._idfv,
      ad_id_opt_out: this._ad_id_opt_out,
      device_os_version: this._device_os_version,
      device_model: this._device_model,
      device_vendor: this._device_vendor,
      device_resolution: this._device_resolution,
      device_portrait: this._device_portrait,
      device_platform: this._device_platform,
      device_network: this._device_network,
      device_wifi: this._device_wifi,
      device_carrier: this._device_carrier,
      device_language: this._device_language,
      device_country: this._device_country,
      device_build_id: this._device_build_id,
      package_name: this._package_name,
      appkey: this._appkey,
      sdk_version: this._sdk_version,
      installer: this._installer,
      app_version: this._app_version,
      event_name: this._event_name,
      event_datetime: this._event_datetime,
      event_timestamp: this._event_timestamp,
      event_timestamp_d: this._event_timestamp_d,
      param_json: this._param_json ? JSON.stringify(this._param_json) : '',
      cb_1: this._cb_1,
      cb_2: this._cb_2,
      cb_3: this._cb_3,
      cb_4: this._cb_4,
      cb_5: this._cb_5,
      product_id: this._product_id,
      currency: this._currency,
      price: this._price,
    };
  }
}
