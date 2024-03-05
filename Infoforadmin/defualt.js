function upload() {
    let images = document.getElementById('image').files;
    let topic = document.getElementById('topic').value.trim(); // เก็บค่า topic ที่ผู้ใช้ป้อน

    // ตรวจสอบว่ามีค่า topic หรือไม่
    if (topic === '') {
        alert("กรุณาตั้งชื่อหัวข้อ");
        return;
    }

    // ตรวจสอบว่ามีไฟล์รูปภาพถูกเลือกหรือไม่
    if (images.length === 0) {
        alert("กรุณาเพิ่มรูปภาพ");
        return;
    }

    let timestamp = new Date().toLocaleString();
    let promises = [];
    let imageUrls = [];

    Array.from(images).forEach(image => {
        let imageName = image.name;
        let storageRef = firebase.storage().ref('images/' + imageName);
        let uploadTask = storageRef.put(image);

        let promise = new Promise((resolve, reject) => {
            uploadTask.on('state_changed', function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("upload is " + progress + " done");
            }, function (error) {
                console.log(error.message);
                reject(error);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    imageUrls.push(downloadURL);
                    resolve();
                });
            });
        });

        promises.push(promise);
    });

    Promise.all(promises)
        .then(() => {
            firebase.database().ref('blogs/').push().set({
                topic: topic,
                imageUrls: imageUrls,
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
                image.src = value.imageUrls;
                image.classList.add('mx-auto', 'd-block', 'mt-3');
                image.style.height = '280px';
                image.style.width = '325px';

                image.addEventListener('click', function () {
                    window.location.href = 'detail.html?id=' + key;
                });


                let cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                let cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = value.topic;

                let timestamp = document.createElement('p');
                timestamp.classList.add('card-text', 'text-muted');
                timestamp.textContent = "Uploaded on " + value.timestamp;

                let deleteBtn = document.createElement('button');
                deleteBtn.classList.add('btn', 'btn-danger', 'mt-2');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', function () {
                    delete_post(key);
                });

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(timestamp);
                cardBody.appendChild(deleteBtn);


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

