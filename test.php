<div id="loader-wrapper">
    <div id="loader"></div>
</div>
<style type="text/css">
#loader-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    /*background-color: #333;*/
}
#loader {
    display: block;
    position: relative;
    left: 50%;
    top: 50%;
    width: 80px;
    height: 80px;
    margin: -75px 0 0 -75px;
    z-index: 1500;
    border: 1px solid transparent;
    border-top-color: #FF8670;
    -webkit-animation-duration: 2s;
    animation-duration : 2s;
}
#loader, #loader:before, #loader:after {
	border-radius: 50%;
	-webkit-animation-name: spin;
    -webkit-animation-timing-function: linear;
    -webkit-animation-delay: initial;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: initial;
    -webkit-animation-fill-mode: initial;
    -webkit-animation-play-state: initial;
	animation-name: spin;
    animation-timing-function: linear;
    animation-delay: initial;
    animation-iteration-count: infinite;
    animation-direction: initial;
    animation-fill-mode: initial;
    animation-play-state: initial;
}
#loader:before, #loader:after {
    content: "";
    position: absolute;
}
#loader:before {
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid transparent;
    border-top-color: #FF6347;
    -webkit-animation-duration: 3s;
    animation-duration : 3s;
}
#loader:after {
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 3px solid transparent;
    border-top-color: #FF401F;
    -webkit-animation-duration: 1.5s;
	animation-duration : 1.5s;
}
 
/* include this only once */
@-webkit-keyframes spin {
    0%   {
        -webkit-transform: rotate(0deg);  /* Chrome, Opera 15+, Safari 3.1+ */
        -ms-transform: rotate(0deg);  /* IE 9 */
        transform: rotate(0deg);  /* Firefox 16+, IE 10+, Opera */
    }
    100% {
        -webkit-transform: rotate(360deg);  /* Chrome, Opera 15+, Safari 3.1+ */
        -ms-transform: rotate(360deg);  /* IE 9 */
        transform: rotate(360deg);  /* Firefox 16+, IE 10+, Opera */
    }
}
@keyframes spin {
    0%   {
        -webkit-transform: rotate(0deg);  /* Chrome, Opera 15+, Safari 3.1+ */
        -ms-transform: rotate(0deg);  /* IE 9 */
        transform: rotate(0deg);  /* Firefox 16+, IE 10+, Opera */
    }
    100% {
        -webkit-transform: rotate(360deg);  /* Chrome, Opera 15+, Safari 3.1+ */
        -ms-transform: rotate(360deg);  /* IE 9 */
        transform: rotate(360deg);  /* Firefox 16+, IE 10+, Opera */
    }
}
</style>