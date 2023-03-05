const header = document.querySelector("header")
const circles = document.querySelector(".animation");

const animation_text = document.querySelector(".section .animation .text")
const path_left_text = document.querySelector(".section .circles .path-left .path-text");
const path_right_text = document.querySelector(".section .circles .path-right .path-text");
const path_left = document.querySelector(".path-left");
const center = document.querySelector(".center");
const path_right = document.querySelector(".path-right");


console.log(window.scrollY + circles.getBoundingClientRect().top, circles)
window.onscroll = function(e) {
  if(window.pageYOffset != 0) {
    header.style = "background-color: #e7e5de; top: 0px;"
  } else {
    header.style = "background-color: transparent; border: none; top: -100px;"
  }
  if(window.pageYOffset > window.scrollY + circles.getBoundingClientRect().top &&window.pageYOffset < window.scrollY + circles.getBoundingClientRect().bottom){
    animation_text.style = "animation: animation-text 2s 2s forwards;";
    path_left_text.style = "animation: circle-text 2s 5s forwards;";
    path_right_text.style = "animation: circle-text 2s 5s forwards;";
    path_left.style = "animation: left-path-stretch 3s 0s forwards, left-path-circle 3s 2s forwards, circle-text 0.3s 3s;";
    center.style = "animation: center 3s 5s forwards;";
    path_right.style = "animation: right-path-stretch 3s 0s forwards, right-path-circle 3s 2s forwards, circle-text 0.3s 3s;";
  }
}

search_bar.addEventListener('focus', (event) => {
  search_btn.style.color = "#0000ff"
})

search_bar.addEventListener('focusout', (event) => {
  search_btn.style.color = "#fff"
})