let btn = document.querySelector('#fireButton');
function btnDown() {
    btn.style.background = '#A60000';
    btn.style.fontSize = '28px';
    btn.style.boxShadow = "0 0 1px rgba(0,0,0) inset, 0 2px 3px rgba(0,0,0) inset, 0 1px 1px rgba(255,255,255,.1)";
    btn.style.border = "2px solid rgb(97, 33, 33)";
}
function btnUp () {
    btn.style.background = 'red';
    btn.style.fontSize = '30px';
    btn.style.border = "2px solid rgba(255,255,255,.1)";
}
btn.addEventListener('mousedown', btnDown);
btn.addEventListener('mouseup', btnUp);


// 0 0 1px rgba(0,0,0) inset, 0 2px 3px rgba(0,0,0) inset, 0 1px 1px rgba(255,255,255,.1)
//0 1px rgba(255,255,255,.2) inset, 0 3px 5px rgba(0,1,6,.5), 0 0 1px 1px rgba(0,1,6,.2)