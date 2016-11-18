/**
 * Created by Kobe on 11/15/2016.
 */
//SIDEBAR
var sidebarCreate   = document.querySelector(".sidebar-create-event");
var sliderCreateBtn = document.querySelector('#slider-create-btn');
var sidebarOverlay  = document.querySelector(".sidebar-overlay");
var sidebarGet      = document.querySelector(".sidebar-get-events");
var dayOfMonth      = document.querySelectorAll(".month_dates");

sliderCreateBtn.addEventListener('click',function(){
    sidebarCreate.classList.add('sidebar-show');
    sidebarOverlay.classList.remove('hide');
});

sidebarOverlay.addEventListener('click',function(){
    sidebarCreate.classList.remove('sidebar-show');
    sidebarOverlay.classList.add('hide');
});

dayOfMonth.forEach(function(day){
    day.addEventListener('click',function(){
        sidebarGet.classList.add('sidebar-show');
        sidebarOverlay.classList.remove('hide');
        console.log(day)
    });
});

sidebarOverlay.addEventListener('click',function(){
    sidebarGet.classList.remove('sidebar-show');
    sidebarCreate.classList.remove('sidebar-show');
    sidebarOverlay.classList.add('hide');
});