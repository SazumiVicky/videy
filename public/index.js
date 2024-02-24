let target = document.documentElement;
let body = document.body;
let fileInput = document.getElementById("selectedFile");

if(fileInput) {
    fileInput.onchange = function() {
        upload();
    }
}

target.addEventListener('dragover', (e) => {
    if ($(".clickListenerFile")[0]) {
        e.preventDefault();
        body.classList.add('dragging');
    }
});

target.addEventListener('dragleave', () => {
    body.classList.remove('dragging');
});

target.addEventListener('drop', (e) => {
    if ($(".clickListenerFile")[0]) {
        e.preventDefault();
        body.classList.remove('dragging');
        fileInput.files = e.dataTransfer.files;
        upload();
    }
});

window.addEventListener('paste', e => {
    fileInput.files = e.clipboardData.files;
    upload();
});

function handleClick() {
    if($(".clickListenerFile")[0]) {
        $(".clickListenerFile").click();
    }
}

function upload() {
    var fileInput = $("#selectedFile").val();
    if(fileInput != "" && fileInput.trim() != "") {
        var formData = new FormData($('form')[0]);
        $(".headline").hide();
        $(".description").hide();
        $(".upload-button").hide();
        $(".headline-uploading").show();
        $(".description-uploading").show();
        $("#selectedFile").removeClass("clickListenerFile");

        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        $(".description-uploading").html(percentComplete + "% complete.");

                        if (percentComplete === 100) {
                            $(".description-uploading").html("Finalizing...");
                        }
                    }
                }, false);

                return xhr;
            },
            url: '/api/upload',
            type: 'POST',
            context: this,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                window.location.href = "/v?id=" + result.id;
            },
            error: function () {
                $(".headline").show();
                $(".description").show();
                $(".upload-button").show();
                $(".headline-uploading").hide();
                $(".description-uploading").hide();
            }
        });
    }
}
