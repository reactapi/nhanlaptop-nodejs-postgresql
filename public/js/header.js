$(document).ready(function() {
    const header = document.querySelector('header.header')
    $(window).scroll(function() {
        const documentHeight = document.body.clientHeight
        if (documentHeight < 1000) {
            if (header.classList.contains('scroll')) {
                header.classList.remove('scroll')
            }
            return
        }
        const scrollValue = $(window).scrollTop()
        if (scrollValue >= 20) {
            header.classList.add('scroll')
        } else {
            header.classList.remove('scroll')
        }
    })

    $(window).scroll(function() {
        const headerMobileTop = $('.header-mobile .header-top')
        const headerMobileBot = $('.header-mobile .header-bottom')
        const scrollValue = $(window).scrollTop()
        if (scrollValue > 10) {
            headerMobileTop.addClass('scroll')
            headerMobileBot.addClass('scroll')
        } else {
            headerMobileTop.removeClass('scroll')
            headerMobileBot.removeClass('scroll')
        }
    })
})


const btnBar = document.querySelector('.header-mobile .btn-bar')
const navBarMobile = document.querySelector('.navbar-mobile')

$('.navbar-mobile .nav-menu > .nav-item > a').click(function(e) {
    e.preventDefault();
    e.stopPropagation()
    $(this).next('.subnav').slideToggle(200)
})

btnBar.addEventListener('click', function() {
    navBarMobile.classList.toggle('active')
    if (navBarMobile.classList.contains('active')) {
        btnBar.querySelector('i').classList = 'fa-solid fa-xmark'
    } else {
        btnBar.querySelector('i').classList = "fa-solid fa-bars"
    }
})
