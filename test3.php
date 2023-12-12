<!DOCTYPE HTML>
<html>
    <head>
        <style>
            body {
                margin: 0px;
                padding: 0px;
            }
        </style>
    </head>
    <body>
        <canvas id="myCanvas"></canvas>
        <script>
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            var x = canvas.width / 2;
            var y = canvas.height / 2;
            var radius = 75;
            var startAngle = 1.1 * Math.PI;
            var endAngle = 1.9 * Math.PI;
            var counterClockwise = false;

            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            context.lineWidth = 5;

            // line color
            context.strokeStyle = 'black';
            context.stroke();
        </script>
    </body>
</html>      