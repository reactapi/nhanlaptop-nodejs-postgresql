$(document).ready(function() {
    $(window).scroll(function() {
        const scrollValue = $(window).scrollTop()
        // show btn scroll to top 
        if (scrollValue > 200) {
            $('.btn-to-top').css({"visibility" : "visible", "opacity" : "1"})
        }
        else {
            $('.btn-to-top').css({"visibility" : "hidden", "opacity" : "0"})
        }
       
    })
    $('.btn-to-top').click(function(){
        $('html, body').animate({scrollTop: 0}, 'slow');
    });
     
})

