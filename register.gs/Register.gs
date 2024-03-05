function getAllData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getActiveSheet();

  var firebaseUrl = "https://registersystem-45fdc-default-rtdb.asia-southeast1.firebasedatabase.app/users";
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl);

  var data = base.getData();
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  
  // set the header row
  var headers = ["ชื่อนาม-สกุล", "อายุ","วันเดือนปีเกิด" ,"เบอร์โทร" ,"น้ำหนัก(กิโลกรัม)" , "ส่วนสูง(เซนติเมตร)","เลขบัตรประชาชน(13หลัก)", "ที่อยู่", "โรคประจำตัว","ประวัติการเเพ้ยา",];
  sheet.appendRow(headers);
  
  // loop through the Firebase data and write to sheet
  for (var key in data) {
    var row = data[key];
    var rowData = [row.ชื่อนามสกุล, row.อายุ, row.วันเดือนปีเกิด, row.เบอร์โทร,row.น้ำหนัก ,row.ส่วนสูง, row.เลขบัตรประชาชน , row.ที่อยู่ ,row.โรคประจำตัว ,row.ประวัติการเเพ้ยา ];
    sheet.appendRow(rowData);
    Logger.log(rowData);
  }
}