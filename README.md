# ListenUp

Ứng dụng luyện nghe và phát âm tiếng Anh qua hành trình của một người Việt mới chuyển đến một nơi xa lạ. Chạy cục bộ với React, TypeScript, Vite, React Router, Tailwind CSS, Lucide và Inter.

## Chạy dự án

Yêu cầu Node 22.12+ hoặc Node 24 và npm.

```powershell
npm ci
npm run dev
```

Mở URL Vite in trong terminal (mặc định http://127.0.0.1:5173). Nếu cổng đang bận, Vite chọn cổng kế tiếp. Muốn chọn cổng cố định: `npm run dev -- --port 5174 --strictPort`.

```powershell
npm test
npm run build
npm run preview
```

Build được xuất ra dist. Khi đưa lên static hosting, cấu hình SPA fallback về index.html cho route ứng dụng để mở trực tiếp `/practice/...` hoặc `/dashboard`.

## Trải nghiệm mẫu

Trên trang Hành trình, bắt đầu với Picking Up My Suitcase. Hoàn thành bài đang mở để tới bài tiếp theo. Màn hình kết quả của lượt luyện hiển thị bạn học và pet đi đến điểm vừa mở. Bạn cũng có thể luyện trong thư viện hoặc ôn qua bài luyện hằng ngày với các bài đã mở. Mở Ghi chú văn hóa để xem bối cảnh, rồi mở Luyện phát âm tiếng Anh để nghe đoạn mẫu và nhắc lại. Transcript hỗ trợ tua theo từng câu.

Năng lượng tối đa 5 và tự hồi 1 điểm sau mỗi 10 phút. Dùng đồ ăn ở cửa hàng để hồi ngay hoặc mang theo để tự dùng một lần khi năng lượng về 0. Từ điển dùng một lượt để giữ năng lượng khi chọn sai. Ở câu thường, bạn được xem đáp án và đi tiếp. Ở câu cuối, hãy thử lại.

Sổ tay cụm từ cộng thêm vàng mỗi câu được tính thưởng và lưu cụm phát âm của bài. Xem cụm đã lưu ở Cửa hàng → Sổ tay cụm từ. Có thể nạp lượt dùng cho từ điển và sổ tay. Hoàn thành mọi bài luyện trong một chủ đề mở khóa thêm vật phẩm.

Nhánh Git cục bộ `backup/adventure-theme` giữ theme phiêu lưu tại commit `0531a5b`. Bài cũ, dấu trang, tiến độ đã nộp và vật phẩm đã mua vẫn đọc được trên trình duyệt.

Danh mục hiện tại có 6 bài, 18 câu hỏi và 4 chủ đề. WAV có sẵn và dùng một giọng tổng hợp tiếng Anh. Dự án hỗ trợ nghe và nhắc lại thành tiếng. Điểm số dựa trên trắc nghiệm. Sinh lại audio trên Windows có giọng en-US bằng:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/generate-audio.ps1
```

Transcript JSON và mốc của đoạn luyện phát âm được sinh cùng audio, dựa trên độ dài PCM. Font đóng gói từ @fontsource/inter (SIL Open Font License), icon từ lucide-react (ISC); giấy phép nằm trong các package tương ứng.

## Giới hạn có chủ đích

- Không có backend, tài khoản thật, phân quyền hoặc admin. Form auth chỉ tạo/cập nhật hồ sơ demo cục bộ; mật khẩu không lưu hay gửi đi.
- Dữ liệu localStorage không đồng bộ thiết bị và có thể mất khi xóa dữ liệu trình duyệt; đây không phải nơi lưu dữ liệu nhạy cảm.
- Điểm chỉ là số câu đúng trên bộ bài mẫu. Nhãn CEFR chưa được thẩm định chuyên môn.
- Thời gian dashboard là thời gian làm bài đã nộp, không đo riêng thời gian audio thực phát.
- Dark mode và mục tiêu học có nhắc tự động chưa triển khai.
- Production nên dùng MP3/CDN, audio được cấp phép và API lưu tiến độ.

## Tài liệu dự án

- [PROJECT_SPEC.md](PROJECT_SPEC.md): yêu cầu, URL, UI, design tokens, dữ liệu và tiêu chí nghiệm thu.
- [AGENTS.md](AGENTS.md): quy tắc cho Codex và các agent phát triển tiếp.
- [TASKS.md](TASKS.md): tiến độ, bằng chứng kiểm tra và các giai đoạn tiếp theo.

Test tự động kiểm tra chấm điểm, tìm kiếm, năng lượng, đồ ăn, từ điển, sổ tay, phần thưởng và đồng bộ WAV/transcript. Kết quả kiểm tra trình duyệt được ghi trong TASKS.md.
