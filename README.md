# ⚡ Công Cụ So Sánh & Tính Tiền Điện Sinh Hoạt: 5 Bậc Mới (01/11/2026) vs 6 Bậc Cũ

> Web app đối chiếu trực tiếp chi phí tiền điện sinh hoạt hàng tháng giữa **Biểu giá bán lẻ 5 bậc mới** (áp dụng từ **01/11/2026**) và **Biểu giá 6 bậc cũ** (Quyết định 2699/QĐ-BCT hiện hành).

🌐 **Trải nghiệm trực tuyến trên Web:** [https://nsnnam.github.io/tinh-tien-dien-5-bac/](https://nsnnam.github.io/tinh-tien-dien-5-bac/)

---

## 📊 Bảng Đối Chiếu Đoạn Thang Chi Tiết (Cũ vs Mới)

| Đoạn tiêu thụ | Quy đổi tương đương | Đơn giá Cũ | Đơn giá Mới | Chênh lệch đơn giá | % Tăng/Giảm |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **0 – 50 kWh** | Cũ B1 / Mới B1 | 1.984 đ/kWh | **1.901 đ/kWh** | -83 đ/kWh | **-4.18%** |
| **51 – 100 kWh** | Cũ B2 / Mới B1 | 2.050 đ/kWh | **1.901 đ/kWh** | -149 đ/kWh | **-7.27%** |
| **101 – 200 kWh** | Cũ B3 / Mới B2 | 2.380 đ/kWh | **2.289 đ/kWh** | -91 đ/kWh | **-3.82%** |
| **201 – 300 kWh** | Cũ B4 / Mới B3 | 2.998 đ/kWh | **2.894 đ/kWh** | -104 đ/kWh | **-3.47%** |
| **301 – 400 kWh** | Cũ B5 / Mới B3 | 3.350 đ/kWh | **2.894 đ/kWh** | -456 đ/kWh | **-13.61%** |
| **401 – 700 kWh** | Cũ B6 / Mới B4 | 3.460 đ/kWh | **3.456 đ/kWh** | -4 đ/kWh | **-0.12%** |
| **Từ 701 kWh trở lên** | Cũ B6 / Mới B5 | 3.460 đ/kWh | **3.844 đ/kWh** | +384 đ/kWh | **+11.10%** |

---

## 🎯 Điểm Nổi Bật Đã Cập Nhật

1. **Bộ điều khiển công tơ điện tử nổi bật ở đầu trang:**
   - Dễ nhìn, thao tác tức thì ngay khi mở trang.
   - Hỗ trợ cả 2 chế độ:
     * **⚡ Nhập nhanh số kWh** với các nút bước nhảy `+10`, `+50`, `-10`, `-50` và thanh trượt trực quan.
     * **🔢 Nhập theo chỉ số công tơ** (Chỉ số mới - Chỉ số cũ) với màn hình tính toán sản lượng tự động.
   - Các nút chọn nhanh mức dùng thực tế (Tháng gần đây 348 kWh, Tháng trước 293 kWh, Cao điểm 340 kWh,...).

2. **So sánh trực tiếp chi phí Cũ vs Mới (Side-by-Side Dual Deck):**
   - Đặt 2 biểu giá song song để thấy rõ sự khác biệt.
   - Huy hiệu chênh lệch tự động: hiển thị số tiền **Tiết kiệm được** hoặc **Chi phí tăng** cùng tỷ lệ %.
   - Khối phân tích tự động giải thích chi tiết nguyên nhân tăng/giảm theo từng mức điện.

3. **Bảng phân rã chi tiết 7 đoạn thang tiêu thụ:**
   - Cung cấp đầy đủ số liệu cho từng đoạn (Sản lượng, Đơn giá cũ/mới, Thành tiền cũ/mới, Tiền chênh lệch, % chênh lệch).
   - Tự động highlight đoạn điện mà hộ gia đình đang tiêu thụ.

4. **Tính toán chính xác 100% theo thực tế:**
   - Áp dụng chuẩn biểu giá cũ theo Quyết định 2699/QĐ-BCT và biểu giá mới từ 01/11/2026.
   - Thuế GTGT tùy chọn linh hoạt 8% (thực tế hóa đơn), 10% hoặc 0%.
   - Đọc số tiền thành chữ tiếng Việt chuẩn xác.

5. **Bảo mật thông tin:**
   - Tuyệt đối không lưu trữ hay để lộ thông tin cá nhân, mã khách hàng hoặc địa chỉ sử dụng điện.

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local)

```bash
git clone https://github.com/Nsnnam/tinh-tien-dien-5-bac.git
cd tinh-tien-dien-5-bac
# Mở trực tiếp file index.html trên bất kỳ trình duyệt nào
```

---

## 📄 Bản Quyền & Nguồn Dữ Liệu
- Nguồn biểu giá: Văn bản chính thức về Biểu giá bán lẻ điện sinh hoạt 5 bậc áp dụng từ ngày 01/11/2026 và Quyết định 2699/QĐ-BCT.
- Giấy phép mã nguồn: MIT License.
