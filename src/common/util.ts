import { TrackingDto } from 'src/tracking/dto/tracking.dto';
import * as moment from 'moment-timezone';

/**
 * 4.메크로스Pro 트래킹 URL 를 트래커 트래킹 URL 변환
 * false 반환 시 잘못된 트래커
 */
export function convertTrackerTrackingUrl(
  tkCode: string,
  trackerTrackingUrl: string,
  requestQuery: TrackingDto,
  viewCode: string,
) {
  const android_device_id =
    requestQuery.adid === '{adid}' ? '' : requestQuery.adid;
  const ios_device_id = requestQuery.idfa === '{idfa}' ? '' : requestQuery.idfa;
  const deviceId: string = android_device_id
    ? android_device_id
    : ios_device_id;

  let convertedTrackerTrackingUrl: string = null;

  switch (tkCode) {
    case 'adbrix':
      /** [애드브릭스]
     * 
      기존 (mecross)
      https://ref.ad-brix.com/v1/referrallink?ak=493312809&ck=3619213&agreement_key={device_id}&sub_referral={sub_referral}&cb_param1={cb_param1}&cb_param2={cb_param2}&cb_param3={cb_param3}&cb_param4={cb_param4}&cb_param5={cb_param5}
      https://ref.ad-brix.com/v1/referrallink?ak=656518674&ck=4120773&agreement_key=36cca4db-76cd-4ae5-a2c6-971a41c64c8f&sub_referral=1764387094&cb_param1=18d1716067114362bb2d&cb_param2=&cb_param3=p_a996d60f-f77b-4676-c6a3-f11987ec136f1607402402925&cb_param4=1764387094&cb_param5=&Deeplink=true
   
      신규 (mecrosspro)
      https://ref.ad-brix.com/v1/referrallink?ak=48793762&ck=1253151&agreement_key={device_id}&cb_param1={cb_param1}&cb_param2={cb_param2}&cb_param3={cb_param3}&cb_param4={cb_param4}&cb_param5={cb_param5}

      agreement_key	{device_id}	device_id (ios_device_id/android_device_id)
      sub_referral	{sub_referral}	노출용 코드  view_code
      cb_param1	{cb_param1}	캠페인토큰 campaign_token
      cb_param3	{cb_param3}	클릭 id   click_id
      cb_param4	{cb_param4}	노출용 코드  view_code
     */
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(
          '{device_id}', //device id
          deviceId,
        )
        .replace(
          '{sub_referral}', //노출용 코드
          viewCode,
        )
        .replace(
          '{cb_param1}', //캠페인 토큰
          requestQuery.token,
        )
        .replace('{cb_param3}', requestQuery.click_id)
        .replace('{cb_param4}', viewCode)
        .replace('{cb_param2}', '')
        .replace('{cb_param5}', '');
      break;
    case 'adbrix_remaster':
      /* 
      [애드브릭스 리마스터]

      기존 (mecross)
      https://fnbFMvaGgkGVcajnoIeUTw.adtouch.adbrix.io/api/v1/click/{app_key}?m_adid={m_adid}&cb_1={cb_1}&cb_2={cb_2}&cb_3={cb_3}&cb_4={cb_4}&cb_5={cb_5}&m_publisher={m_publisher}
      https://J7x68n2WfkCK1kqDRVrIWQ.adtouch.adbrix.io/api/v1/click/oazfGhFipUG7Q3ak8KRVSQ?m_adid=&cb_1=3dd1c1591757740573f5&cb_2=1713901267&cb_3=5fcf05fd232ae7bc26f193ce&cb_4=ota_foss_kr&cb_5=&m_publisher=1713901267&utm_source=mecross&utm_medium=NCPA&utm_campaign=application_Lifepromotion&utm_content=201113_double_A

      신규 (mecrosspro)
      https://fnbFMvaGgkGVcajnoIeUTw.adtouch.adbrix.io/api/v1/click/zGeIPJm0TUSfqTsZrCSGpg?cb_1={cb_1}&cb_2={cb_2}&cb_3={cb_3}&cb_4={cb_4}&cb_5={cb_5}&m_publisher={m_publisher}&m_sub_publisher=&{m_sub_publisher}&m_adid={m_adid}
      
      m_adid	{m_adid}	device_id (ios_device_id/android_device_id)
      cb_1	{cb_1}	캠페인토큰 campaign_token
      cb_2	{cb_2}	노출용 코드  view_code
      cb_3	{cb_3} 	클릭 id   click_id
      m_publisher	{m_publisher}	노출용 코드  view_code

      cb_4	{cb_4}	ota_foss_kr     - 광고주 or 트래커에서 디폴트로 삽입??
    */
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(
          '{m_adid}', //device id
          deviceId,
        )
        .replace(
          '{cb_2}', //노출용 코드
          viewCode,
        )
        .replace(
          '{cb_1}', //캠페인 토큰
          requestQuery.token,
        )
        .replace(
          '{cb_3}', //클릭 id
          requestQuery.click_id,
        )
        .replace(
          '{m_publisher}', //노출용 코드
          viewCode,
        )
        .replace('{cb_4}', '')
        .replace('{cb_5}', '');
      break;
    case 'appsflyer':
      /** [앱스플라이어]
      기존 (mecross)
      https://app.appsflyer.com/app_id?pid=mecross_int&clickid={clickid}&af_siteid={af_siteid}&af_c_id={af_c_id}&af_adset_id={af_adset_id}&af_ad_id={af_ad_id}&advertising_id={adid}&idfa={idfa}
      https://app.appsflyer.com/com.btckorea.bithumb?af_siteid=1791092443&af_c_id=6747415943616902cdf1&af_adset_id=&af_ad_id=&af_prt=icomas&pid=mecross_int&c=Comas_nCPA&clickid=2B5M4dc4ye0U0YEZ900KDutiP0jvd1&af_siteid=1791092443&invitecode={invitecode}&advertising_id=BD388AEC-70AA-465E-8403-F9F23353E0B1&idfa=
    
      신규 (mecrosspro)
      https://app.appsflyer.com/{app_id}?pid=mecrosspro_int&clickid={clickid}&af_siteid={af_siteid}&af_c_id={af_c_id}&af_adset_id={af_adset_id}&af_ad_id={af_ad_id}&advertising_id={advertising_id}&idfa={idfa}&af_ip={af_ip}&af_ua={af_ua}&af_lang={af_lang}

      af_siteid	      {af_siteid}	   노출용 코드         view_code // 2개 
      af_c_id	        {af_c_id}	     캠페인토큰          campaign_token
      af_adset_id	    {af_adset_id}	 ""
      af_ad_id	      {af_ad_id}	   ""
      clickid	        {clickid}	     클릭 id             click_id
      adid	          {adid} 	                           android_device_id
      idfa	          {idfa}	                           ios_device_id
          
      iOS 14	
      S2S CLICKS: af_lang - language of the device, af_ ua - user agent, af_ip - IP of the device 파라미터 추가  (매체: iOS 필수값) -   포스트백 달라짐 (동의 여부에 따라)
      {af_lang}	device_language
      {af_ua}	user_agent
      {af_ip}	device_ip
     */
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(
          '{clickid}', //클릭 id
          requestQuery.click_id,
        )
        .replace(
          '{af_siteid}', //노출용 코드
          viewCode,
        )
        .replace(
          '{af_c_id}', //캠페인 토큰
          requestQuery.token,
        )
        .replace(
          '{advertising_id}', //android device id
          android_device_id,
        )
        .replace(
          '{idfa}', //ios device id
          ios_device_id,
        )
        .replace('{af_adset_id}', '')
        .replace('{af_ad_id}', '')
        .replace('{af_ip}', '')
        .replace('{af_ua}', '')
        .replace('{af_lang}', '');
      break;
    case 'mobiconnect':
      /** [모비커넥트]
      http://click.mobiconnect.co.kr/tracking/track/clickApi?offer_id={offer_id}&pub_id={pub_id}&pub_click_id={mecross_clickid}&pub_sub_id1={mecross_pubid}&gaid={gaid}&ifa={ifa}&custom_id1={mecross_token}&custom_id2={mecross_clickid}&custom_id3={mecross_subid}
      http://click.mobiconnect.co.kr/tracking/track/clickApi?offer_id=6100&pub_id=1765&pub_click_id=5fcf0ab8566af9d126b299c0&pub_sub_id1=2203880832&gaid=d2b927da-4e35-4259-b344-6b71797ebf35&ifa=&custom_id1=c2ded16070691717664e&custom_id2=5fcf0ab8566af9d126b299c0&custom_id3=ota_fifa_kr
     
      pub_click_id	{mecross_clickid}	클릭 id    click_id
      pub_sub_id1	  {mecross_pubid}	노출용 코드   view_code    
      gaid	        {gaid}	                     android_device_id
      ifa	          {ida}	                       ios_device_id
      custom_id1	  {mecross_token}	캠페인토큰    campaign_token
      custom_id2	  {mecross_clickid}	클릭 id     click_id

      custom_id3	{mecross_subid}	ota_fifa_kr   광고주 or 트래커에서 디폴트로 삽입??
      offer_id, pu_id 는 모비커넥트가 채우는 용??		
    */
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(/{mecross_clickid}/gi, requestQuery.click_id)
        .replace('{mecross_token}', requestQuery.token)
        .replace('{mecross_pubid}', viewCode)
        .replace('{gaid}', android_device_id)
        .replace('{ifa}', ios_device_id);
      break;
    case 'airbridge':
      /** [에어브릿지]
      https://abr.ge/{app_subdomain}/mecross?click_id={CLICK_ID}&sub_id={SUBID}&gaid_raw={GAID}&ifa_raw={IDFA}&custom_sub1={custom_sub1}&custom_sub2={custom_sub2}&custom_sub3={custom_sub3}&custom_sub4={custom_sub4}&custom_sub5={custom_sub5}
      https://abr.ge/@greencar/mecross?click_id=f4602d112-fc3f-ef40-e047ea9da942e8748f17cf650d7e988e9bc67bc63ff003f&sub_id=2414867714&gaid_raw=f62d4881-7245-4f8d-b96a-e26bf1aff3bd&ifa_raw=&custom_sub1=ca2f11604623898e03b8&custom_sub2=&custom_sub3=&custom_sub4=&custom_sub5=&tracking_template_id=83e01fe9913104a65f6e5d6dac6634ce&routing_short_id=4bsv&is_reengagement=0&campaign=mecross&ad_group=CPI&ad_creative=new_benefit&ad_type=click

      click_id	{CLICK_ID}	클릭 id   click_id
      sub_id	{SUB_ID}	노출용 코드  view_code    // 2개 
      gaid_raw	{GAID}	 android_device_id
      ifa_raw	{IDFA}	 ios_device_id
      custom_sub1	{custom_sub1}	캠페인토큰 campaign_token
     */
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(
          '{GAID}', //andorid device id
          android_device_id,
        )
        .replace(
          '{IDFA}', //ios device id
          ios_device_id,
        )
        .replace(
          '{SUB_ID}', //노출용 코드
          viewCode,
        )
        .replace(
          '{custom_sub1}', //캠페인 토큰
          requestQuery.token,
        )
        .replace(
          '{CLICK_ID}', //클릭 id
          requestQuery.click_id,
        )
        .replace('{custom_sub2}', '')
        .replace('{custom_sub3}', '')
        .replace('{custom_sub4}', '')
        .replace('{custom_sub5}', '');
      break;
  }

  return convertedTrackerTrackingUrl;
}

interface postBackData {
  tkCode?: string;
  viewCode?: string;
  clickId?: string;
  deviceId?: string;
  deviceIosId?: string;
  deviceAndroidId?: string;
  deviceCarrier?: string;
  deviceCountry?: string;
  deviceLanguage?: string;
  deviceIp?: string;
  appkey?: string;
  clickDatetime?: string;
  installDatetime?: string;
  eventName?: string;
  eventDatetime?: string;
  productId?: string;
  price?: number;
  currency?: string;
}

// export function postBackInstall(req: PostbackInstallDto) {
//   const returnData: postBackData = {};

//   if (req.cb_param3 && req.cb_param4) {
//     //애드브릭스
//     returnData.tkCode = 'adbrix';
//   }
//   if (req.cb_2 && req.cb_3) {
//     //애드브릭스-리마스터
//     returnData.tkCode = 'adbrix_remaster';
//   }
//   if (req.af_siteid && req.clickid) {
//     //앱스플라이어
//     returnData.tkCode = 'appsflyer';
//   }

//   switch (returnData.tkCode) {
//     case 'adbrix':
//       returnData.viewCode = req.cb_param4;
//       returnData.clickId = req.cb_param3;
//       returnData.deviceId = !req.ifa ? req.gaid : req.ifa;
//       returnData.deviceCarrier = req.carrier;
//       returnData.deviceCountry = req.country;
//       returnData.deviceLanguage = req.language;
//       returnData.deviceIp = req.click_ip;
//       returnData.appkey = req.appkey;
//       returnData.clickDatetime = req.session_dt_kst //20201220105052211
//         ? convertTimeToFormat(req.session_dt_kst)
//         : '1970-01-01 00:00:00';
//       returnData.installDatetime = req.install_dt_kst //20201220105116000
//         ? convertTimeToFormat(req.install_dt_kst)
//         : '1970-01-01 00:00:00';
//       break;

//     case 'adbrix_remaster':
//       const installDatetime2 = req.event_datetime
//         ? moment(req.event_datetime.replace('+', ' ').split('.')[0]).add(
//             9,
//             'hours',
//           )
//         : moment('1970-01-01 00:00:00');
//       //event_datetime=2020-12-28+01:41:10.422

//       const clickDatetime2 = req.event_datetime
//         ? moment(req.event_datetime.replace('+', ' ').split('.')[0])
//             .add(9, 'hours')
//             .subtract(req.seconds_gap, 'seconds')
//         : moment('1970-01-01 00:00:00');

//       returnData.viewCode = req.cb_2;
//       returnData.clickId = req.cb_3;
//       returnData.deviceId = req.adid; //공통
//       returnData.deviceCarrier = req.device_carrier;
//       returnData.deviceCountry = req.device_country;
//       returnData.deviceLanguage = req.device_language;
//       returnData.appkey = req.appkey;
//       returnData.deviceIp = req.a_ip;
//       returnData.clickDatetime = clickDatetime2.format('YYYY-MM-DD HH:mm:ss');
//       returnData.installDatetime = installDatetime2.format(
//         'YYYY-MM-DD HH:mm:ss',
//       );
//       break;

//     case 'appsflyer':
//       const clickDatetime3 = req.click_time
//         ? moment(decodeURIComponent(req.click_time)).add(9, 'hours')
//         : moment('1970-01-01 00:00:00'); //click_datetime=2021-02-03%2006%3A11%3A06.725

//       const installDatetime4 = req.install_time
//         ? moment(decodeURIComponent(req.install_time)).add(9, 'hours')
//         : moment('1970-01-01 00:00:00'); //install_datetime=2021-02-03%2006%3A11%3A17.223

//       returnData.viewCode = req.af_siteid; //노출용코드
//       returnData.clickId = req.clickid; //클릭id
//       returnData.deviceId = !req.idfa ? req.advertising_id : req.idfa;
//       returnData.deviceCarrier = req.device_carrier;
//       returnData.deviceCountry = req.country_code;
//       returnData.deviceLanguage = req.language;
//       returnData.deviceIp = '';
//       returnData.appkey = '';
//       returnData.clickDatetime = clickDatetime3.format('YYYY-MM-DD HH:mm:ss');
//       returnData.installDatetime = installDatetime4.format(
//         'YYYY-MM-DD HH:mm:ss',
//       );
//       break;
//   }

//   return returnData;
// }

// export function postBackEvent(req: PostbackEventDto) {
//   const returnData: postBackData = {};

//   if (req.install_cb_param3 && req.install_cb_param4) {
//     //애드브릭스
//     returnData.tkCode = 'adbrix';
//   }
//   if (req.cb_2 && req.cb_3) {
//     //애드브릭스-리마스터
//     returnData.tkCode = 'adbrix_remaster';
//   }
//   if (req.af_siteid && req.clickid) {
//     //앱스플라이어
//     returnData.tkCode = 'appsflyer';
//   }

//   switch (returnData.tkCode) {
//     case 'adbrix':
//       returnData.viewCode = req.install_cb_param4;
//       returnData.clickId = req.install_cb_param3;
//       returnData.deviceIosId = req.ifa;
//       returnData.deviceAndroidId = req.gaid;
//       returnData.deviceId = returnData.deviceAndroidId
//         ? returnData.deviceAndroidId
//         : returnData.deviceIosId;
//       returnData.deviceCarrier = req.carrier;
//       returnData.deviceCountry = req.country;
//       returnData.deviceLanguage = req.language;
//       returnData.appkey = req.appkey;
//       returnData.installDatetime = req.install_dt_kst //20201220105116000
//         ? convertTimeToFormat(req.install_dt_kst)
//         : '1970-01-01 09:00:00';
//       returnData.eventName = req.activity;
//       returnData.eventDatetime = req.event_dt_kst //20201220105224000
//         ? convertTimeToFormat(req.event_dt_kst)
//         : '1970-01-01 09:00:00';
//       returnData.productId = req.product_id;
//       returnData.price = req.sales;
//       returnData.currency = req.currency;
//       break;

//     case 'adbrix_remaster':
//       const productArr = req.param_json ? JSON.parse(req.param_json) : null;

//       if (productArr['abx:item.abx:sales']) {
//         returnData.productId = productArr['abx:item.abx:product_id'];
//         returnData.price = productArr['abx:item.abx:sales'];
//         returnData.currency = productArr['abx:item.abx:currency'];
//       } else if (productArr['abx:items']) {
//         for (const item of productArr['abx:items']) {
//           returnData.price += item['abx:sales'];
//           returnData.productId = item['abx:product_id'];
//           returnData.currency = item['abx:currency'];
//         }
//       }

//       returnData.viewCode = req.cb_2;
//       returnData.clickId = req.cb_3;
//       returnData.deviceId = req.adid; //공통
//       returnData.deviceCarrier = req.device_carrier;
//       returnData.deviceCountry = req.device_country;
//       returnData.deviceLanguage = req.device_language;
//       returnData.appkey = req.appkey;
//       returnData.installDatetime = req.attr_event_timestamp
//         ? moment
//             .unix(req.attr_event_timestamp) //attr_event_timestamp=1609286883
//             .format('YYYY-MM-DD HH:mm:ss')
//         : '1970-01-01 00:00:00';
//       returnData.eventName = req.event_name;
//       returnData.eventDatetime = req.event_timestamp
//         ? moment
//             .unix(req.event_timestamp) //event_timestamp=1609369877
//             .format('YYYY-MM-DD HH:mm:ss')
//         : '1970-01-01 00:00:00';
//       break;

//     case 'appsflyer':
//       const installDatetime2 = req.install_time
//         ? moment(decodeURIComponent(req.install_time)).add(9, 'hours')
//         : moment('1970-01-01 00:00:00'); //install_datetime=2021-02-03%2006%3A11%3A17.223

//       const eventDatetime2 = req.event_time
//         ? moment(decodeURIComponent(req.event_time)).add(9, 'hours')
//         : moment('1970-01-01 00:00:00'); //event_datetime=2021-02-03%2006%3A11%3A34.007

//       returnData.viewCode = req.af_siteid;
//       returnData.clickId = req.clickid;
//       returnData.deviceIosId = req.idfa;
//       returnData.deviceAndroidId = req.advertising_id;
//       returnData.deviceId = returnData.deviceAndroidId
//         ? returnData.deviceAndroidId
//         : returnData.deviceIosId;
//       returnData.deviceCarrier = req.device_carrier;
//       returnData.deviceCountry = req.country_code;
//       returnData.deviceLanguage = req.language;
//       returnData.appkey = '';
//       returnData.installDatetime = installDatetime2.format(
//         'YYYY-MM-DD HH:mm:ss',
//       );
//       returnData.eventName = req.event_name;
//       returnData.eventDatetime = eventDatetime2.format('YYYY-MM-DD HH:mm:ss');
//       returnData.productId = '';
//       returnData.price = req.event_revenue;
//       returnData.currency = req.event_revenue_currency;
//       break;
//   }
//   return returnData;
// }

// export function convertTimeToFormat(datetime) {
//   const datetimeFormat =
//     datetime.substring(0, 4) +
//     '-' +
//     datetime.substring(4, 6) +
//     '-' +
//     datetime.substring(6, 8) +
//     ' ' +
//     datetime.substring(8, 10) +
//     ':' +
//     datetime.substring(10, 12) +
//     ':' +
//     datetime.substring(12, 14);

//   return moment(datetimeFormat).format('YYYY-MM-DD HH:mm:ss');
// }
