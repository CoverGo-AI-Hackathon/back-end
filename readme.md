---
title: "BRD - Conversational Sales Assistant (Ddi9)"
author: "Covergo AI Hackathon"
date: "`r Sys.Date()`"
output: html_document
---

# 🎯 Mục Tiêu Dự Án

Xây dựng một **trợ lý hội thoại thông minh** tích hợp vào trang sản phẩm bảo hiểm (Sun Life VHIS), đóng vai trò như một nhân viên tư vấn bảo hiểm chuyên nghiệp. Mục tiêu:

- Hướng dẫn khách hàng chọn đúng sản phẩm bảo hiểm phù hợp.
- Tương tác tự nhiên, giải thích sản phẩm, so sánh tính năng.
- Thu thập dữ liệu hội thoại để tạo hồ sơ khách hàng cho CRM.

---

# 🧠 Bài Toán Kinh Doanh

Các trang bảo hiểm hiện nay thường:
- Không cá nhân hóa trải nghiệm.
- Dùng form thu thập thông tin không hiệu quả.
- Không giúp người dùng hiểu rõ sản phẩm.

Cần một trợ lý số:
- Trò chuyện tự nhiên.
- Hiểu được nhu cầu mơ hồ.
- Đưa ra gợi ý phù hợp và ghi nhận dữ liệu hành vi.

---

# 🛠️ Giải Pháp Đề Xuất

Phát triển một **AI Chatbot** với các khả năng:

- Trò chuyện tự nhiên như người thật.
- Đưa ra câu hỏi thông minh để hiểu nhu cầu.
- Tư vấn và so sánh các sản phẩm VHIS.
- Tạo **CRM profile** từ hội thoại.

---

# 🖥️ Yêu Cầu Chức Năng

| Tính năng chính | Mô tả |
|------------------|-------|
| 💬 Chat Interface | Giao diện chat ở góc dưới website sản phẩm. |
| ❓ Hỏi & Đáp | Trả lời câu hỏi như "loại nào tốt cho người lớn tuổi?", "có gói nào cho trẻ em không?" |
| 🎯 Hiểu nhu cầu | Bot sẽ tự động hỏi về: tình trạng gia đình, ngân sách, ưu tiên sức khỏe... |
| 📊 Gợi ý sản phẩm | Đưa ra các gợi ý dựa trên nhu cầu thu thập được từ người dùng. |
| 📝 Xuất dữ liệu CRM | Tạo JSON hoặc bảng thông tin khách hàng từ cuộc trò chuyện. |
| 🧠 Nhớ ngữ cảnh | Bot ghi nhớ chi tiết như “có 2 con nhỏ” để dùng ở đoạn sau hội thoại. |

---

# 📌 Yêu Cầu Output

- Giao diện chat dễ sử dụng, trực quan.
- Tư vấn sản phẩm Sun Life VHIS chính xác, không quá tải thông tin.
- Tạo file CRM (mock) từ dữ liệu hội thoại: JSON hoặc bảng.
- Không hỏi thông tin cá nhân sớm (trừ khi khách hàng chủ động).

---

# ❔ Câu Hỏi Cần Giải Quyết

- Bot có hiểu được nhu cầu mơ hồ như "muốn bảo hiểm tốt cho con"?  
- Có thể tư vấn mà không gây bối rối giữa nhiều lựa chọn?  
- Làm sao giữ tone thân thiện, mà vẫn thu thập dữ liệu có cấu trúc?  
- Có thể gợi ý đúng thời điểm? Biết lặp lại thông tin trước đó?  
- Trước khi xin thông tin cá nhân, làm sao tạo đủ giá trị cho khách hàng?

---

# 🔗 Dữ liệu sản phẩm

Sử dụng bộ sản phẩm VHIS của Sun Life làm nền tảng tư vấn.  
Link tham khảo: [Sun Life VHIS Overview](#)

---
