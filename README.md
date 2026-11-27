# ListenUp

Game RPG phiêu lưu luyện nghe tiếng Anh, chạy cục bộ với React, TypeScript, Vite, React Router, Tailwind CSS, Lucide và Inter.

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

Từ Bản đồ ải, chọn một ải chiến dịch hoặc ải hằng ngày. Bạn cũng có thể vào ải của một bài qua Bài học → At the Coffee Shop → Bắt đầu luyện nghe. Trong mỗi chặng, nghe audio, kiểm tra đáp án rồi tiếp tục. Mở rương giữa ải và cuối ải để nhận vật phẩm. Chọn bài trên màn hình hoàn thành để xem điểm và lời giải.

Mỗi chặng đã phân định cho 15 vàng trước thưởng từ kiếm. Sinh mệnh tối đa là 5 và tự hồi 1 sau mỗi 10 phút. Dùng thuốc trực tiếp trong cửa hàng hoặc trang bị một loại thuốc để tự dùng một lần khi sinh mệnh về 0 trong ải. Khi hết sinh mệnh mà không thể tự dùng thuốc, lượt đó thất bại.

Khiên giữ sinh mệnh khi trả lời sai và hao 1 độ bền. Ở chặng thường, khiên cho bỏ qua chặng và xem đáp án đúng. Ở chặng cuối, khiên chỉ giữ sinh mệnh và bạn vẫn phải tự trả lời đúng. Khi không có khiên còn độ bền, mỗi câu sai trừ 1 sinh mệnh và bạn phải thử lại.

Cửa hàng dùng vàng để mua thuốc, khiên, kiếm và pet, hoặc bảo dưỡng trang bị đã sở hữu. Hoàn thành tất cả các ải của một chủ đề để mở khóa thêm hàng.

Transcript mặc định đóng, có thể mở và nhấn từng dòng để tua. Tiến độ chặng, vàng, sinh mệnh, kho đồ, dấu trang và lịch sử được lưu trên trình duyệt. Sprite nhân vật của Ozzbit Games dùng theo giấy phép cá nhân, phi thương mại. Sprite mèo từ Pet Cats Pack dùng giấy phép CC0.

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

Test tự động kiểm tra luật hồi sinh mệnh, khiên, kiếm, rương và lượt ải hằng ngày, cùng grading, tìm kiếm tiếng Việt và hợp đồng WAV/transcript của sáu bài. Kết quả kiểm tra trình duyệt được ghi trong TASKS.md.
