# ⚡ Công Cụ Tính Tiền Điện Sinh Hoạt 5 Bậc Mới (Áp dụng từ 01/11/2026)

> Web app tra cứu và tính toán số tiền điện sinh hoạt hàng tháng theo **Biểu giá bán lẻ điện sinh hoạt 5 bậc** mới nhất, áp dụng chính thức từ ngày **01/11/2026**.

🌐 **Dùng thử trực tiếp trên Web:** [https://nsnnam.github.io/tinh-tien-dien-5-bac/](https://nsnnam.github.io/tinh-tien-dien-5-bac/)

---

## 📸 Biểu Giá Bán Lẻ Điện Sinh Hoạt 5 Bậc Mới

| Bậc | Khoảng kWh tiêu thụ | Đơn giá (chưa VAT) | Ghi chú & Đặc điểm |
| :---: | :--- | :---: | :--- |
| **Bậc 1** | **Từ 0 - 100 kWh** | **1.901 đ/kWh** | Nới rộng từ 50 lên 100 kWh, hỗ trợ tối đa hộ dùng ít & hộ khó khăn |
| **Bậc 2** | **Từ 101 - 200 kWh** | **2.289 đ/kWh** | Áp dụng cho mức dùng vừa phải của hộ gia đình nhỏ |
| **Bậc 3** | **Từ 201 - 400 kWh** | **2.894 đ/kWh** | Khung rộng 200 kWh cho hộ phổ thông dùng các thiết bị cơ bản |
| **Bậc 4** | **Từ 401 - 700 kWh** | **3.456 đ/kWh** | Khung rộng 300 kWh cho gia đình dùng nhiều máy lạnh/thiết bị điện |
| **Bậc 5** | **Từ 701 kWh trở lên** | **3.844 đ/kWh** | Bậc cao nhất nhằm khuyến khích sử dụng điện tiết kiệm |

---

## ✨ Điểm Nổi Bật Của Ứng Dụng

- **Giao diện công tơ điện tử thông minh (Smart Electric Meter HUD):** Màn hình LED/LCD 6 chữ số phát quang phong cách điện tử hiện đại, đèn tín hiệu PULSE nhấp nháy chân thực.
- **Font chữ Be Vietnam Pro:** Chuẩn font tiếng Việt sắc nét, hiện đại kết hợp font số digital monospace.
- **Tính toán thời gian thực (Real-time):** Chỉ cần nhập số lượng điện (kWh) hoặc kéo thanh trượt là ra ngay số tiền phải trả.
- **Đọc số tiền thành chữ tiếng Việt:** Tự động chuyển đổi chính xác (Ví dụ: *Một triệu không trăm bốn mươi lăm nghìn ba trăm ba mươi hai đồng*).
- **Hỗ trợ 2 chế độ nhập liệu:**
  1. Nhập trực tiếp số kWh tiêu thụ.
  2. Nhập theo chỉ số công tơ (Chỉ số đầu kỳ - Chỉ số cuối kỳ).
- **So sánh trực quan với Biểu giá 6 bậc cũ:** Cho biết ngay gia đình bạn tăng hay giảm bao nhiêu nghìn đồng khi chuyển sang biểu giá mới.
- **Phân bổ chi tiết 5 bậc:** Thanh biểu đồ năng lượng đa màu hiển thị trực quan lượng điện đã dùng ở từng bậc.
- **Tùy chọn thuế GTGT (VAT):** 8% (phổ biến), 10% (tiêu chuẩn), hoặc 0% (chưa thuế).
- **Nút tiện ích:**
  - 📋 *Sao chép kết quả* gửi nhanh qua Zalo/tin nhắn.
  - 🔗 *Chia sẻ liên kết* lưu sẵn số kWh trên URL.
  - 🖨️ *In hóa đơn* theo mẫu phiếu thu đẹp mắt.
  - 🖼️ *Xem ảnh gốc văn bản* ban hành biểu giá.
- **Chế độ Sáng / Tối (Dark / Light mode):** Tự động lưu lựa chọn của người dùng.
- **Không phụ thuộc thư viện nặng (Zero-dependency):** Tải trang tức thì trong 0.2s, chạy mượt trên mọi thiết bị di động và máy tính.

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local)

Chỉ cần clone repository và mở file `index.html` trong bất kỳ trình duyệt nào:

```bash
git clone https://github.com/Nsnnam/tinh-tien-dien-5-bac.git
cd tinh-tien-dien-5-bac
# Mở trực tiếp file index.html hoặc dùng live server
```

---

## 📄 Bản Quyền & Nguồn Dữ Liệu

- Dữ liệu biểu giá được trích xuất từ văn bản chính thức về Biểu giá bán lẻ điện sinh hoạt 5 bậc áp dụng từ ngày 01/11/2026.
- Giấy phép mã nguồn: MIT License.
