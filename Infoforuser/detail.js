function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


document.addEventListener("DOMContentLoaded", function () {
    var postId = getParameterByName('id');

    if (postId) {
        function fetchData() {
            firebase.database().ref('blogs/' + postId).once('value').then(function (snapshot) {
                var detailContent = snapshot.val();

                if (detailContent) {
                    var blogDetailContent = document.getElementById('blog-detail-content');
                    var imageUrls = detailContent.imageUrls;
                    var imageElements = "";

                    imageUrls.forEach(function (imageUrl) {
                        // เพิ่มคลาส .img-wrapper เพื่อล้อมรูปภาพ
                        imageElements += "<div class='img-wrapper' onclick='showDetail()'><img src='" + imageUrl + "' class='img-fluid mx-auto d-block mb-3' alt='Image'></div>";
                    });

                    blogDetailContent.innerHTML =
                        "<h2 class='card-title text-center'>" + detailContent.topic + "</h2>" +
                        "<p class='card-text'>Uploaded on " + detailContent.timestamp + "</p>" +
                        imageElements ;

                } else {
                    console.log("Post not found");
                }
            });
        }

        fetchData();

        var refreshButton = document.getElementById('refresh-button');
        if (refreshButton) {
            refreshButton.addEventListener('click', function () {
                fetchData();
            });
        }
    } else {
        console.log("Post ID not provided");
    }
});
