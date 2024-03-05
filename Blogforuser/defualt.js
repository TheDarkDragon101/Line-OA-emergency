function upload() {
    let images = document.getElementById('image').files;
    let post = document.getElementById('post').value;
    let topic = document.getElementById('topic').value;
    let timestamp = new Date().toLocaleString();
    if (topic === '') {
        alert("กรุณาตั้งชื่อหัวข้อ");
        return;
    }

    // ตรวจสอบว่ามีไฟล์รูปภาพถูกเลือกหรือไม่
    if (images.length === 0) {
        alert("กรุณาเพิ่มรูปภาพ");
        return;
    }

    let promises = []; // เก็บ Promise สำหรับการอัปโหลดแต่ละรูปภาพ
    let imageUrls = []; // เก็บ URL ของรูปภาพที่อัปโหลด

    // Loop ผ่านทุกไฟล์
    Array.from(images).forEach(image => {
        let imageName = image.name;
        let storageRef = firebase.storage().ref('images/' + imageName);
        let uploadTask = storageRef.put(image);

        // เก็บ Promise สำหรับอัปโหลดรูปภาพ
        let promise = new Promise((resolve, reject) => {
            uploadTask.on('state_changed', function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("upload is " + progress + " done");
            }, function (error) {
                console.log(error.message);
                reject(error);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    imageUrls.push(downloadURL); // เพิ่ม URL ของรูปภาพลงในอาร์เรย์
                    resolve(); // สำเร็จ
                });
            });
        });

        promises.push(promise); // เพิ่ม Promise ลงในอาร์เรย์
    });

    // รอให้ทุก Promise สำเร็จก่อนทำการสร้างโพสต์ใน Firebase Database
    Promise.all(promises)
        .then(() => {
            // เมื่อทุกรูปภาพถูกอัปโหลดเสร็จสิ้น
            // สร้างโพสต์ใน Firebase Database พร้อมกับ URL ของรูปภาพทั้งหมด
            firebase.database().ref('blogs/').push().set({
                topic: topic,
                text: post,
                imageUrls: imageUrls, // นำ URL ของรูปภาพเข้าไปในโพสต์
                timestamp: timestamp
            }, function (error) {
                if (error) {
                    console.error("Error while uploading:", error.message);
                    alert("Error while uploading: " + error.message);
                } else {
                    console.log("Successfully uploaded");
                    alert("Successfully uploaded");
                    document.getElementById('post-form').reset();
                    getdata();
                }
            });
        })
        .catch(error => {
            alert("Error while uploading: " + error.message);
        });
}

window.onload = function () {
    this.getdata();
}
function getdata() {
    let posts_div = document.getElementById('posts');
    posts_div.innerHTML = "";

    // ดึงข้อมูลโพสต์และเรียงลำดับตาม timestamp จาก Firebase Realtime Database
    firebase.database().ref('blogs/').orderByChild('timestamp').once('value').then(function (snapshot) {
        let data = snapshot.val();

        if (data) {
            let dataArray = Object.entries(data);
            let sortedDataArray = dataArray.sort((a, b) => {
                return new Date(a[1].timestamp) - new Date(b[1].timestamp);
            });

            sortedDataArray.reverse()

            sortedDataArray.forEach(([key, value]) => {
                // สร้าง HTML สำหรับแสดงโพสต์
                let postContainer = document.createElement('div');
                postContainer.classList.add('col-sm-4', 'mt-2', 'mb-2');

                let card = document.createElement('div');
                card.classList.add('card');

                let image = document.createElement('img');
                image.src = value.imageUrls; // Fix this line to imageURL
                image.classList.add('mx-auto', 'd-block', 'mt-3');
                image.style.height = '280px';
                image.style.width = '325px';

                let cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                let cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = value.topic;

                let cardText = document.createElement('p');
                cardText.classList.add('card-text');
                cardText.textContent = value.text.length > 200 ? value.text.substring(0, 200) + '...' : value.text;

                let timestamp = document.createElement('p');
                timestamp.classList.add('card-text', 'text-muted');
                timestamp.textContent = "Uploaded on " + value.timestamp;

                // Change readMoreBtn to link to detail.html with the post key
                let readMoreLink = document.createElement('a');
                readMoreLink.href = 'detail.html?id=' + key; // Use key as parameter
                readMoreLink.classList.add('btn', 'btn-primary', 'mr-2');
                readMoreLink.textContent = 'Read More';

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(timestamp);
                cardBody.appendChild(readMoreLink);


                card.appendChild(image);
                card.appendChild(cardBody);

                postContainer.appendChild(card);

                posts_div.appendChild(postContainer);
            });
        } else {
            console.log("No posts found");
        }
    }).catch(function (error) {
        console.error("Error fetching data:", error.message);
        alert("Error fetching data: " + error.message);
    });
}


function delete_post(key) {

    let postRef = firebase.database().ref('blogs/' + key);


    postRef.remove()
        .then(function () {
            console.log("Post deleted successfully");
        })
        .catch(function (error) {
            console.error("Error deleting post:", error.message);
            alert("Error deleting post: " + error.message);
        })
        .finally(function () {

            getdata();
        });
}

const search = document.getElementById('search');

search.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase(); // รับข้อความที่ใส่ลงในช่องค้นหาและแปลงเป็นตัวพิมพ์เล็กทั้งหมด

    const posts_div = document.getElementById('posts');
    const posts = posts_div.querySelectorAll('.card');

    posts.forEach(post => {
        const title = post.querySelector('.card-title').textContent.toLowerCase(); // รับชื่อเรื่องของโพสต์และแปลงเป็นตัวพิมพ์เล็กทั้งหมด
        if (title.includes(searchText)) {
            post.classList.remove('hide');
            post.classList.add('show');
        } else {
            post.classList.remove('show');
            post.classList.add('hide');
        }
    });
});

