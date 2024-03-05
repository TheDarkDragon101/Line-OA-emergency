function doGet(e) {
  return HtmlService.createTemplateFromFile("index").evaluate()
}

function userClick(data) {
  let ss = SpreadsheetApp.openById('1UZFchx1S6e_eMxAYoFGLKpfSosyKzHi0ce9f_thxmRs');
  let sheet = ss.getSheets()[0];

  // Reverse geocode to get the address from latitude and longitude
  let response = Maps.newGeocoder().reverseGeocode(data.lat, data.lon);
  let geoAddress = response.results[0].formatted_address;

  // Format date and time
  var checkboxData = [];

  // Check the state of each checkbox and include relevant information
  if (data.checkbox1.checked) {
    checkboxData.push(data.checkbox1.text);
  }
  if (data.checkbox2.checked) {
    checkboxData.push(data.checkbox2.text);
  }
  if (data.checkbox3.checked) {
    checkboxData.push(data.checkbox3.text);
  }
  if (data.checkbox4.checked) {
    checkboxData.push(data.checkbox4.text);
  } if (data.checkbox5.checked) {
    checkboxData.push(data.checkbox5.text);
  } if (data.checkbox6.checked) {
    checkboxData.push(data.checkbox6.text);
  }
  
  var strYear543 = parseInt(Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy")) + 543;
  var strhour = Utilities.formatDate(new Date(), "Asia/Bangkok", "HH");
  var strMinute = Utilities.formatDate(new Date(), "Asia/Bangkok", "mm");
  var strMonth1 = Utilities.formatDate(new Date(), "Asia/Bangkok", "M");
  var strMonthCut1 = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  var strMonthThai = strMonthCut1[strMonth1];
  var strDay = Utilities.formatDate(new Date(), "Asia/Bangkok", "d");
  var daytime = strDay + ' ' + strMonthThai + ' ' + strYear543 + ' เวลา ' + strhour + ':' + strMinute + ' น.';

  // Create the text data for notification
  var text_data1 = '📣 แจ้งพิกัดเหตุฉุกเฉิก\n';
  text_data1 += '⏰ \n' + daytime + '\n👨‍💼ผู้เเจ้งเหตุ:' + data.username + '\n📱เบอร์โทร:' + data.phoneNumber + '\n⚕️อาการเบื่องต้น:\n' + checkboxData.join('\n') + '\n📌พิกัด: \n' + data.lat + ", " + data.lon + '\n🏡ที่อยู่: \n' + geoAddress;

  // Append data to the spreadsheet
  sheet.appendRow([
    data.username,
    data.phoneNumber,
    checkboxData.join(', '), // Join checkboxData with a comma and space
    Utilities.formatDate(new Date(), "GMT+7", "MM/dd/yyyy HH:mm:ss"),
    `${data.lat},${data.lon}`,
    geoAddress,
  ]);

  // Create a static map and send the notification
  var latitude = data.lat;
  var longitude = data.lon;
  var map = Maps.newStaticMap()
    .setSize(600, 600)
    .setLanguage('TH')
    .setMobile(true)
    .setMapType(Maps.StaticMap.Type.HYBRID);

  map.addMarker(latitude, longitude);
  var mapBlob = map.getBlob();
  sendHttpPostImage(text_data1, mapBlob);
}

function sendHttpPostImage(mapUrl, mapBlob) {
  var token = "Y5yTyZk359fTa35qGC7iV2v3Dv2iW5tzy8SQ7IAxHSS";
  var formData = {
    'message': '\n' + mapUrl,
    'imageFile': mapBlob
  }
  var options =
  {
    "method": "post",
    "payload": formData,  // message, imageFile, formData, Post
    "headers": { "Authorization": "Bearer " + token }
  };

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent()
}

// jvOWaVBjoovr95gWj1s47hInVOyeLxeJlurYXggxE3i กลุ่ม + พี่หลุย
// Y5yTyZk359fTa35qGC7iV2v3Dv2iW5tzy8SQ7IAxHSS ส่วนตัวไว้ทดสอบระบบ
