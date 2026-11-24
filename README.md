# ListenUp

Bộ khung frontend luyện nghe tiếng Anh theo kế hoạch được cung cấp. React + TypeScript + Vite, React Router, Tailwind CSS 4/CSS variables, Lucide và font Inter phục vụ cục bộ.

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

Vào Bài học → At the Coffee Shop → Bắt đầu luyện nghe → Phát audio → Chọn đáp án → Kiểm tra hoặc chuyển câu → Nộp bài → Xem kết quả. Transcript mặc định đóng, có thể mở và nhấn từng dòng để tua. Tốc độ, âm lượng, chữ lớn, dấu trang, bản nháp và lịch sử được lưu trên trình duyệt.

6 bài mẫu, 20 câu hỏi, 4 chủ đề, trình độ A1–B2. Audio WAV có sẵn, không gọi dịch vụ bên ngoài khi phát. Nội dung demo gốc được đọc bằng Windows English speech voice; giọng tổng hợp một người, không phải bản thu hội thoại thật. Có thể sinh lại trên Windows có English voice bằng:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/generate-audio.ps1
```

Transcript JSON được sinh cùng audio, dựa trên độ dài PCM. Font đóng gói từ @fontsource/inter (SIL Open Font License), icon từ lucide-react (ISC); giấy phép nằm trong các package tương ứng.

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

Test tự động hiện kiểm tra grading (gồm index 0/câu chưa trả lời), tìm kiếm tiếng Việt không dấu, header WAV và mốc transcript của cả 6 bài. Kiểm tra tương tác trình duyệt trong quá trình triển khai được ghi tại TASKS.md.
