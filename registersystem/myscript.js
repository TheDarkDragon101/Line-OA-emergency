var firebaseConfig = {
  apiKey: "AIzaSyAVB6ifvmnsaU69O2uW93Le4TCKUE60c8o",
  authDomain: "registersystem-45fdc.firebaseapp.com",
  databaseURL: "https://registersystem-45fdc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "registersystem-45fdc",
  storageBucket: "registersystem-45fdc.appspot.com",
  messagingSenderId: "790820786119",
  appId: "1:790820786119:web:84a0f4345bee3b5d6e53e2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function readForm() {
  nameV = document.getElementById("name").value;
  ageV = document.getElementById("age").value;
  phoneV = document.getElementById("phone").value;
  addressV = document.getElementById("address").value;
  dateofbirthV = document.getElementById("dateofbirth").value;
  weightV = document.getElementById("weight").value;
  heightV = document.getElementById("height").value;
  idcardV = document.getElementById("idcard").value;
  congenitaldiseaseV = document.getElementById("congenitaldisease").value;
  historyofdrugallergiesV = document.getElementById("historyofdrugallergies").value;
  noteV = document.getElementById("note").value;

  // ตรวจสอบค่าวันเดือนปีเกิด
  // (ในตัวอย่างนี้จะเช็คเฉพาะรูปแบบ วัน-เดือน-ปี ตามรูปแบบที่กำหนด)

  if (nameV.trim() === "") {
    alert("กรุณากรอกชื่อ");
    return false;
  }

  if (!dateofbirthV.match(/^\d{4}-\d{2}-\d{2}$/)) {
    alert("วันเดือนปีเกิดไม่ถูกต้อง");
    return false;
  }
  // ตรวจสอบความถูกต้องของข้อมูล (ตัวอย่างเช่น สำหรับเบอร์โทร)

  if (!phoneV.match(/^\d{10}$/)) {
    alert("เบอร์โทรไม่ถูกต้อง");
    return false;
  }

  // ตรวจสอบค่าอายุ
  if (isNaN(ageV) || ageV < 1) {
    alert("อายุไม่ถูกต้อง");
    return false;
  }

  // ตรวจสอบค่าน้ำหนัก
  if (isNaN(weightV) || weightV < 1) {
    alert("น้ำหนักไม่ถูกต้อง");
    return false;
  }

  // ตรวจสอบค่าส่วนสูง
  if (isNaN(heightV) || heightV < 1) {
    alert("ส่วนสูงไม่ถูกต้อง");
    return false;
  }

  // ตรวจสอบเลขบัตรประชาชน (สมมติว่าเลขบัตรประชาชนมี 13 หลัก)
  if (!idcardV.match(/^\d{13}$/)) {
    alert("เลขบัตรประชาชนไม่ถูกต้อง");
    return false;
  }

  // ตรวจสอบค่าอื่น ๆ ตามความต้องการ (เช่น ที่อยู่, โรคประจำตัว, ประวัติการแพ้ยา, หมายเหตุ)

  // คืนค่า true เมื่อข้อมูลถูกต้องทั้งหมด
  return true;
}

document.getElementById("insert").onclick = function () {
  if (!readForm()) {
    return; // หยุดการดำเนินการถ้าข้อมูลไม่ถูกต้อง
  }

  // ถ้าข้อมูลถูกต้อง, ทำการส่งข้อมูลไปยัง Firebase
  firebase
    .database()
    .ref("users/" + nameV)
    .set({
      ชื่อนามสกุล: nameV,
      อายุ: ageV,
      เบอร์โทร: phoneV,
      ที่อยู่: addressV,
      วันเดือนปีเกิด: dateofbirthV,
      น้ำหนัก: weightV,
      ส่วนสูง: heightV,
      เลขบัตรประชาชน: idcardV,
      โรคประจำตัว: congenitaldiseaseV,
      ประวัติการเเพ้ยา: historyofdrugallergiesV,
      หมายเหตุ: noteV,
    });
  // แสดงข้อความแจ้งเตือน
  alert("ขึ้นทะเทียนเสร็จสิ้น");

  // ล้างค่าในฟอร์ม
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
  document.getElementById("dateofbirth").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("height").value = "";
  document.getElementById("idcard").value = "";
  document.getElementById("address").value = "";
  document.getElementById("congenitaldisease").value = "";
  document.getElementById("historyofdrugallergies").value = "";
  document.getElementById("note").value = "";
};
// document.getElementById("read").onclick = function () {
//   readFom();

//   firebase
//     .database()
//     .ref("student/" + rollV)
//     .on("value", function (snap) {
//       document.getElementById("roll").value = snap.val().rollNo;
//       document.getElementById("name").value = snap.val().name;
//       document.getElementById("gender").value = snap.val().gender;
//       document.getElementById("address").value = snap.val().address;
//     });
// };

// document.getElementById("update").onclick = function () {
//   readFom();

//   firebase
//     .database()
//     .ref("student/" + rollV)
//     .update({
//       //   rollNo: rollV,
//       name: nameV,
//       gender: genderV,
//       address: addressV,
//     });
//   alert("Data Update");
//   document.getElementById("roll").value = "";
//   document.getElementById("name").value = "";
//   document.getElementById("gender").value = "";
//   document.getElementById("address").value = "";
// };
// document.getElementById("delete").onclick = function () {
//   readFom();

//   firebase
//     .database()
//     .ref("student/" + rollV)
//     .remove();
//   alert("Data Deleted");
//   document.getElementById("roll").value = "";
//   document.getElementById("name").value = "";
//   document.getElementById("gender").value = "";
//   document.getElementById("address").value = "";
// };
