
let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {}; // Player object
let orbs = [];
let players = [];

let canvas = document.querySelector('#the-canvas');
let context = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;

// Load the login modal
$(window).load(function(){
    $('#loginModal').modal('show');
});

$('.name-form').submit((event) => {
    event.preventDefault();
    player.name = $('#name-input').val();
    console.log(player);
    $('#loginModal').modal('hide');
    $('#spawnModal').modal('show');
    $('.player-name').html(player.name);
});

$('.start-game').click((event) => {
    // Hide all modals
    $('.modal').modal('hide');
    $('.hiddenOnStart').removeAttr('hidden');
    init();
});