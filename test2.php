<!doctype html>
<html class="no-js" lang="">
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script src="https://demos.wearede.com/depreloadjs/jquery.DEPreLoad.js"></script>
    </head>
    <body>
        <div id="depreload" style="background-image:url('https://demos.wearede.com/depreloadjs/demo/bgr.jpg');" class="table">
            <div class="table-cell wrapper">
                <div class="circle">
                    <canvas class="line" width="560px" height="560px"></canvas>
                    <img src="https://demos.wearede.com/depreloadjs/demo/logo.png" class="logo" alt="logo" />
                </div>
                <p class="perc" style="color: #fff;"></p>
                <p class="loading">Loading</p>
            </div>
        </div>

        <div class="gallery">
            <img src="https://demos.wearede.com/depreloadjs/demo/stock/image1.jpg">
            <img src="https://demos.wearede.com/depreloadjs/demo/stock/image2.jpg">
            <img src="https://demos.wearede.com/depreloadjs/demo/stock/image3.jpg">
            <img src="https://demos.wearede.com/depreloadjs/demo/stock/image4.jpg">
            <img src="https://demos.wearede.com/depreloadjs/demo/stock/image5.jpg">
            <img src="https://demos.wearede.com/depreloadjs/demo/stock/image6.jpg">
            <img src="https://demos.wearede.com/depreloadjs/demo/stock/image7.jpg">
        </div>

        <script>
            $(document).ready(function() {
                
                setTimeout(function(){
                    $("#depreload .wrapper").animate({ opacity: 1 });
                }, 400);

                setTimeout(function(){
                    $("#depreload .logo").animate({ opacity: 1 });
                }, 800);

                var canvas  = $("#depreload .line")[0],
                    context = canvas.getContext("2d");

                context.beginPath();
                context.arc(280, 280, 260, Math.PI * 1.5, Math.PI * 1.6);
                context.strokeStyle = '#fff';
                context.lineWidth = 5;
                context.stroke();

                var loader = $("body").DEPreLoad({
                    OnStep: function(percent) {
                        console.log(percent + '%');

                        $("#depreload .line").animate({ opacity: 1 });
                        $("#depreload .perc").text(percent + "%");

                        if (percent > 5) {
                            context.clearRect(0, 0, canvas.width, canvas.height);
                            context.beginPath();
                            context.arc(280, 280, 260, Math.PI * 1.5, Math.PI * (1.5 + percent / 50), false);
                            context.stroke();
                        }
                    },
                    OnComplete: function() {
                        console.log('Everything loaded!');

                        $("#depreload .perc").text("done");
                        $("#depreload .loading").animate({ opacity: 0 });
                    }
                });
            });
        </script>
    </body>
</html>
