/**
 * Created by Kobe on 11/15/2016.
 */
var sidebarGet = document.querySelector(".sidebar-get-events");
var sliderGetBtn = document.querySelector('#slider-get-btn');
var sidebarCreate = document.querySelector(".sidebar-create-event");
var sliderCreateBtn = document.querySelector('#slider-create-btn');
var sidebarOverlay = document.querySelector(".sidebar-overlay");

sliderGetBtn.addEventListener('click',function(){
    sidebarGet.classList.add('sidebar-show');
    sidebarOverlay.classList.remove('hide');
});

sliderCreateBtn.addEventListener('click',function(){
    sidebarCreate.classList.add('sidebar-show');
    sidebarOverlay.classList.remove('hide');
});

sidebarOverlay.addEventListener('click',function(){
    sidebarGet.classList.remove('sidebar-show');
    sidebarCreate.classList.remove('sidebar-show');
    sidebarOverlay.classList.add('hide');
});
