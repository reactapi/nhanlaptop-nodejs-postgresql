export class CCart {
    
    constructor() {
        this.products = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        this.html = ``
    }

    getAll() {
        return this.products
    }

    addToCart(input) {
        const { productId, quantity } = input
        let isFind = false
        this.products.forEach(product => {
            if (product.productId == productId) {
                isFind = true
                product.quantity += parseInt(quantity)
                return
            }
        })

        if (!isFind) {
            this.products.push(input)
        }

        this.saveToLocalStorage()
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.products))
    }

    updateQuantityById({productId, quantity}) {

        this.products.forEach((product) => {
            if (productId == product.productId) {
                product.quantity = quantity
                return
            }
        })

        this.saveToLocalStorage()
    }

    deleteItem(productId) {
        let indexDelete = -1
        this.products.forEach((product, index) => {
            if (productId == product.productId) {
                indexDelete = index
                return
            }
        })
        if (indexDelete >= 0) {
            this.products.splice(indexDelete, 1)
            this.saveToLocalStorage()
        }
    }

    getCountProduct() {
        return this.products.length
    }

    getTotal() {
        const result = this.products.reduce((total, current) => {
            return total + (current.productPrice * current.quantity)
        }, 0)

        return result
    }

    async getProductInfo(productId) {
        let product = {}
        await fetch(`/api/v1/product/${productId}`)
            .then(res => res.json())
            .then(result => {
                if (result.status == 'success') {
                    product = result.product
                }
            })
        return product
    }
    toHTML() {
        let html = ``
        
        this.products.forEach((product) => {

            const { productId, productName, productSlug, productPrice, quantity, productInfo, 
                productThumbnail, productType } = product

            let totalItemPrice = productPrice * quantity

            let productPriceFormat = new Intl.NumberFormat('de-DE').format(productPrice)
            let totalItemPriceFormat = new Intl.NumberFormat('de-DE').format(totalItemPrice)

            html += `<tr data-price="${productPrice}">
                        <td>
                            <a href="/san-pham/${productSlug}">
                            <div class="cart-product">
                                <div class="row">
                                        <div class="col col-xl-4 col-0 col-sm-0">
                                            <img src="${productThumbnail}" alt="">
                                        </div>
                                        <div class="col col-xl-8 col-12 col-sm-12">
                                            <div class="product-info">
                                                <p>${productName} ${!!productInfo ? `<span class="detail">(${productInfo})</span>` : ""}</p>
                                                <p>Mã SP: <b>${productId}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </td>
                        <td>${productPriceFormat}đ</td>
                        <td>
                            <div class="item-quanity">
                                <div class="box-quanity-select">
                                    <button class="sub btn-quantity-change">-</button>
                                    <input data-id="${productId}" type="number" class="input-quantity" min="1" step="1" value="${quantity}" size="5">
                                    <button class="add btn-quantity-change">+</button>
                                </div>
                            </div>
                        </td>
                        <td>
                            <p class="total-item-price">${totalItemPriceFormat}đ</p>
                        </td>
                        <th>
                            <button class="btn-delete-from-cart" data-id="${productId}" data-price="${productPrice}" data-total="${totalItemPrice}">
                                <i class="bi bi-x-lg"></i>  
                            </button>
                        </th>
                    </tr>`
        })

        this.html = html
    }

    getHTML() {
        return this.html
    }

    destroy() {
        this.products = []
        this.html = ``
        this.saveToLocalStorage()
    }
}