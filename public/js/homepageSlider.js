$(document).ready(function() {
    const arrSlide = $('.slide-item')
    const arrDot = $('.slider .dot')
    // console.log(arrDot)
    let currentSlide = 0;
    function autoNextSlide() {
        ++currentSlide;
        
        if (currentSlide < 5) {
            let transform = currentSlide * (-100);
            $.each(arrSlide, function(index, item) {
                $(this).css('transform', `translateX(${transform}%)`)
                // Active dot
                if (index != currentSlide)
                    arrDot.eq(index).removeClass('active')
                else arrDot.eq(index).addClass('active')
            })
        }
        else {
            currentSlide = -1;
        }
        
    }
    setInterval(() => {
        autoNextSlide()
    }, 10000);
})


