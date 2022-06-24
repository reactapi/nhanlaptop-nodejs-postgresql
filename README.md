# NHAN LAPTOP - Laptop, linh kiện máy tính

## CÁC CÔNG NGHỆ SỬ DỤNG

- **Frond-End:** HTML, CSS, Javascript, Jquery(Ajax), [Bootstrap](https://getbootstrap.com/)
- **Back-End:** NodeJS(Express)
- **Database:** SQL(PostgreSQL)
- **Template Engine:** [EJS](https://ejs.co/)
- **Khác:** [Ckeditor](https://ckeditor.com/), [Chart.js](https://www.chartjs.org/), [JWT](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt), [Cloudinary](https://www.npmjs.com/package/cloudinary), [csurf](https://www.npmjs.com/package/csurf), [nodemailer](https://nodemailer.com/about/)

## CÁC CHỨC NĂNG CHÍNH

- CRUD danh mục, sản phẩm, nhân viên
- Xác thực, phân quyền người dùng
- Đổi mật khẩu, đặt lại mặt khẩu
- Lưu trữ ảnh trên Cloudinary
- Tìm kiếm, live search (có sử dụng debounce), lọc sản phẩm
- Chức năng giỏ hàng, đặt hàng
- Thống kê

## [LINK DEPLOY](https://nhanlaptop.herokuapp.com/)

## Setup Local Development Enviroment

1. Clone dự án về local và trỏ đến thư mục

```
    https://github.com/ngonhan71/nhanlaptop-nodejs-postgresql
    cd nhanlaptop-nodejs-postgresql
```

2. Mở Terminal, cài đặt các Dependencies:

```
    npm install
```

3. Tạo file .env, tạo các biến môi trường như sau:
   > Các biến về Cloudinary, cần tạo tài khoản cloudinary để nhận được
   >
   > Các biến về Gmail API, vào [Google Developer Console](https://console.cloud.google.com/) để tạo

```
    PORT = 3000

    SESSION_SECRET=secret-bat-ky

    DB_HOST=localhost
    DB_USERNAME=root
    DB_PASSWORD=""
    DB_NAME=nhanlaptop

    JWT_SECRET=jwtnhanlaptop!@#

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    GOOGLE_GMAIL_CLIENT_ID=
    GOOGLE_GMAIL_CLIENT_SECRET=
    GOOGLE_GMAIL_REDIRECT_URI=
    GOOGLE_GMAIL_REFRESH_TOKEN=
```

4. Install PostgreSQL. Tạo CSDL _nhanlaptop_, chạy file data.sql
5. Run

```
    node index.js
```

6. Mở trình duyệt Web, truy cập localhost với port 3000

```
    localhost:3000
```
