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

                // เพิ่มอีเวนต์คลิกให้กับภาพ
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

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(timestamp);
                

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

