const barsBtn = document.querySelector('.nav-item.bars')
const navBar = document.querySelector('.admin-wrapper .nav')

const isFullScreen = localStorage.getItem('isFullScreen') || 'false'


if (isFullScreen == 'true') {
    if (!navBar.classList.contains('full')) {
        navBar.classList.add('full')
    }
} else {
    if (navBar.classList.contains('full')) {
        navBar.classList.remove('full')
    }
}

barsBtn.addEventListener('click', function(e) {
    e.preventDefault()

    navBar.classList.toggle('full')

    if (navBar.classList.contains('full')) {
        localStorage.setItem('isFullScreen', 'true')
    } else {
        localStorage.setItem('isFullScreen', 'false')
    }

})