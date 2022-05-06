function formatPrice(price) { 
    return new Intl.NumberFormat('de-DE').format(price)
}

function roundPrice(price) {
    return Math.round(price/10000)*10000
}

function roundAndFormatPrice(price) {
    return formatPrice(roundPrice(price))
}

function randomString(length) {
    const data = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = '';
    for (let i = 0; i < length; i++) {
        index = Math.floor(Math.random() * (data.length - 1))
        result += data[index];
    }
    return result;
}

function formatDate(date) {
    if (date) {
        return date.toISOString().slice(0, 10) + " " + date.toLocaleTimeString('en-GB')
    } 
    return date
}

function formatFullName(fullName) {
    if (fullName) {
        return fullName.split(' ')[0]
    } 
    return fullName
}

function pagination(totalPage, currentPage) {
    if (totalPage <= 1) {
        return;
    } 
    let html = `<nav class="pagination-container">
                    <ul class="pagination">`
    

    if (currentPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="?page=${currentPage - 1}">Previous</a></li>`
    }
                                
    const availablePage = [1, currentPage - 1, currentPage, currentPage + 1, totalPage]
    let isFirst = isLast = false

    for (let i = 0; i < totalPage; i++) {
        if (!availablePage.includes(i + 1)) {
            if (!isFirst && currentPage > 3) {
                html += `<li class="page-item"><a class="page-link" href="?page=${currentPage - 2}">...</a></li>`
                isFirst = true;
            }
            if (!isLast && (i+1) > currentPage) {
                html += `<li class="page-item"><a class="page-link" href="?page=${currentPage + 2}">...</a></li>`
                isLast = true;
            }
            continue;
        }
        if (currentPage == (i + 1)) {
            html += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`
        } else {
            html += `<li class="page-item "><a class="page-link" href="?page=${i + 1}">${i + 1}</a></li>`
            
        }
    }

    if (currentPage < totalPage) {
        html += `<li class="page-item"><a class="page-link" href="?page=${currentPage + 1}">Next</a></li>`
    }
    html += `   </ul>
            </nav>`
    return html
    
}

module.exports = { 
    formatPrice,
    roundPrice,
    roundAndFormatPrice,
    randomString,
    formatDate,
    formatFullName,
    pagination
}