function gallery(url, items, options) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        try {
            if (this.status == 200) {
                responsive(JSON.parse(this.responseText));
            }
        } catch(e) {
        } finally {
            initGallery();
        }
    };
    xhr.open("get", url + "/responsive.json");
    xhr.send();

    function initGallery() {
        blueimp.Gallery(items, options);
    }

    function resizeImages(resolution) {
        for (var i = 0; i < items.length; i++) {
            items[i].href = items[i].href.replace(".jpg", "-" + resolution + "px.jpg");
        }
    }

    function responsive(config) {
        if (config.enabled) {
            var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var resolution = 640;
            config.resolutions.forEach(function(option) {
                if (option <= width && option > resolution) {
                    resolution = option;
                }
            });

            resizeImages(resolution);
        }
    }
}
