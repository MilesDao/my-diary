# 📖 Nhật Ký & Kệ Sách Cá Nhân (Jake & Finn Style)

Chào mừng bạn đến với **Hành Trình Ooo** (My Diary & Bookshelf) — một ứng dụng lưu bút ký cá nhân kết hợp kệ sách review tiện dụng, được thiết kế theo phong cách cắt dán cổ điển (vintage scrapbook) lấy cảm hứng từ thế giới Adventure Time.

Ứng dụng hoạt động **100% cục bộ (local-first)** trên trình duyệt của bạn, đảm bảo tính riêng tư tuyệt đối cho mọi kỷ niệm và suy ngẫm của bạn.

---

## ✨ Tính Năng Nổi Bật

### 1. ✍️ Nhật Ký Ooo (Adventure Diary)
*   **Trình viết lưu bút cổ điển**: Viết nhật ký trên nền giấy dòng kẻ kẻ ngang học sinh cùng dòng lề đỏ chân thực.
*   **Cảm xúc phong phú**: Gắn nhãn cảm xúc Jake-style với emoji và màu sắc tương ứng (Vui vẻ, Yên bình, Suy tư, U sầu, Hoài niệm, Hào hứng, Mệt mỏi).
*   **Thẻ từ khóa động**: Thêm các hashtag tag để phân loại bài viết và dễ dàng tìm kiếm lại.
*   **Xem trước đắm chìm**: Đọc lại nhật ký trong khung giao diện mở sổ tay lật trang mượt mà.

### 2. 📚 Kệ Sách Ooo (Book Review Shelf)
*   **Giao diện Kệ gỗ 3D**: Trưng bày các cuốn sách đã đọc dưới dạng lưới bìa sách 3D có hiệu ứng nổi bật khi rê chuột.
*   **Tải ảnh bìa trực tiếp (Upload Cover)**: Tải ảnh bìa sách yêu thích của bạn từ máy tính lên. Ảnh sẽ được chuyển đổi sang Base64 và lưu trữ riêng tư trực tiếp trên máy của bạn.
*   **Bìa sách tự động (CSS Book Cover Generator)**: Nếu bạn không tải ảnh lên, hệ thống sẽ tự sinh bìa sách nghệ thuật (vintage leather/cloth bound gradients) dựa trên tiêu đề sách và in chìm tên sách/tác giả bằng font chữ chân thực.
*   **Đánh giá sao động**: Hệ thống chọn sao trực quan từ 1 đến 5 sao bằng cách click chuột.
*   **Tích hợp liên kết sách**: Gán liên kết mua sách hoặc thông tin giới thiệu sách (URL) trực tiếp vào bài đánh giá.
*   **Giao diện đọc review rộng rãi**: Đọc review sách trên trang sổ đơn rộng rãi, dễ nhìn, chữ căn chỉnh chuẩn mực đặt gọn gàng phía trên dòng kẻ vở.

### 3. ⚙️ Cấu Hình & Thống kê thông minh
*   **Thông tin cá nhân**: Tùy chỉnh tiêu đề nhật ký, lời tựa và chọn các ảnh đại diện ký họa vintage có sẵn.
*   **Thống kê chi tiết**:
    *   Theo dõi chuỗi ngày viết liên tục (Streak 🔥).
    *   Biểu đồ phần trăm phân bố cảm xúc nhật ký.
    *   Thống kê tổng số sách đã đọc & Điểm đánh giá sao trung bình.
    *   Biểu đồ phân bố điểm số sao đánh giá sách.
*   **Sao lưu & Khôi phục hoàn hảo**: Xuất toàn bộ nhật ký + review sách ra tệp tin JSON và nhập lại dễ dàng trên thiết bị khác. Hỗ trợ tương thích ngược với các file sao lưu nhật ký phiên bản cũ.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **CSS Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: [Motion for React](https://motion.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Lưu trữ**: LocalStorage (100% Client-side)

---

## 🚀 Hướng Dẫn Chạy Dự Án Dưới Local

### Yêu cầu hệ thống:
*   [Node.js](https://nodejs.org/) (Phiên bản 18 trở lên)

### Các bước cài đặt:

1.  **Cài đặt các gói thư viện phụ thuộc**:
    ```bash
    npm install
    ```

2.  **Khởi động môi trường phát triển (Development Server)**:
    ```bash
    npm run dev
    ```
    Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

3.  **Biên dịch dự án cho production**:
    ```bash
    npm run build
    ```
