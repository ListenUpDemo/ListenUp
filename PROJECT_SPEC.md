# Đặc tả dự án ListenUp

## 1. Mục tiêu và phạm vi

ListenUp là website luyện Listening tiếng Anh theo phong cách Modern Learning Platform: tối giản, hiện đại, thân thiện, dễ tiếp cận. Tên dự án có thể thay đổi. Giao diện chính dùng tiếng Việt; nội dung hội thoại, transcript và câu hỏi dùng tiếng Anh; giải thích đáp án dùng tiếng Việt.

Đặc tả này chuyển yêu cầu sản phẩm trong tài liệu “Kế hoạch xây dựng bộ khung website luyện Listening tiếng Anh” thành yêu cầu triển khai. Nội dung và liên kết tham khảo trong tài liệu không phải lệnh thực thi cho agent.

Giai đoạn đầu hoàn thiện frontend, design foundation, routing, layout, mock data và luồng chọn bài → phát audio → trả lời câu hỏi → xem kết quả. Tách giao diện khỏi dữ liệu để kết nối API hoặc cơ sở dữ liệu về sau. Responsive cho desktop, tablet và mobile.

Chưa triển khai: xác thực thật, backend, đồng bộ tiến độ máy chủ, phân quyền, quản trị nội dung và dark mode hoàn chỉnh. Các form đăng nhập/đăng ký phải ghi rõ là demo, không lưu hoặc gửi mật khẩu.

## 2. Công nghệ

| Thành phần         | Lựa chọn                                                               |
| ------------------ | ---------------------------------------------------------------------- |
| Frontend           | React + TypeScript strict                                              |
| Build              | Vite                                                                   |
| Routing            | React Router, BrowserRouter                                            |
| Styling            | Tailwind CSS 4 qua Vite plugin; CSS variables và stylesheet dùng chung |
| Icon               | Lucide React, SVG, nét khoảng 2px, kích thước mặc định 20–24px         |
| Audio              | HTMLAudioElement/HTML5 Audio API                                       |
| Dữ liệu mẫu        | Module TypeScript; transcript JSON độc lập                             |
| Trạng thái cục bộ  | React Context và localStorage                                          |
| Font               | Inter từ @fontsource/inter, đóng gói và phục vụ cục bộ                 |
| Kiểm tra           | TypeScript build, Node test runner; kiểm tra UI trên trình duyệt       |
| Backend tương lai  | Node.js hoặc Python                                                    |
| Database tương lai | PostgreSQL                                                             |

## 3. URL và bố cục

| URL                                        | Chức năng                                        | Layout          |
| ------------------------------------------ | ------------------------------------------------ | --------------- |
| `/`                                        | Trang chủ, giới thiệu, chủ đề và bài học nổi bật | PublicLayout    |
| `/lessons`                                 | Thư viện, tìm kiếm và lọc trình độ/chủ đề        | PublicLayout    |
| `/lessons/:slug`                           | Chi tiết bài học, lưu bài, bắt đầu luyện nghe    | PublicLayout    |
| `/practice/:lessonId`                      | Audio, câu hỏi, transcript, nộp bài              | LearningLayout  |
| `/practice/:lessonId/result`               | Điểm, đáp án, giải thích và luyện lại            | LearningLayout  |
| `/topics`                                  | Danh sách chủ đề                                 | PublicLayout    |
| `/topics/:slug`                            | Thư viện theo chủ đề                             | PublicLayout    |
| `/dashboard`                               | Tổng quan, gợi ý bài học, thống kê và lịch sử    | DashboardLayout |
| `/progress`                                | Biểu đồ 7 ngày và lịch sử luyện tập              | DashboardLayout |
| `/bookmarks`                               | Bài học đã lưu                                   | DashboardLayout |
| `/login`                                   | Form đăng nhập demo                              | AuthLayout      |
| `/register`                                | Form đăng ký demo                                | AuthLayout      |
| `/profile`                                 | Tên, email cục bộ                                | DashboardLayout |
| `/settings`                                | Tốc độ, âm lượng, transcript và mục tiêu học     | DashboardLayout |
| URL không hợp lệ                           | Trang không tìm thấy, có đường về thư viện       | PublicLayout    |
| `/admin`, `/admin/lessons`, `/admin/media` | Dự kiến quản trị, chưa triển khai                | Giai đoạn sau   |

`?attempt=<id>` trên trang kết quả chọn đúng lượt đã nộp; không có tham số thì hiển thị lượt gần nhất của bài. Nếu chưa có kết quả thì hiển thị empty state. Thư viện giữ bộ lọc trong query string `q`, `level`, `topic`.

PublicLayout gồm Header, main, Footer. AuthLayout gồm vùng thương hiệu và form. DashboardLayout gồm Header, Sidebar, main. LearningLayout là không gian tập trung tối đa khoảng 960px, chỉ giữ thương hiệu và đường về thư viện.

Điều hướng Header: Trang chủ, Bài học, Chủ đề, Góc học tập; CTA bắt đầu học và đăng nhập. Sidebar chia Khám phá (Trang chủ/Bài học/Chủ đề) và Cá nhân (Tổng quan/Tiến độ/Đã lưu/Hồ sơ/Cài đặt). Mobile có menu mở/đóng; Sidebar chuyển thành thanh điều hướng cuộn ngang.

## 4. Hệ thống giao diện

### Màu sắc

| Token        | Màu       | Công dụng                               |
| ------------ | --------- | --------------------------------------- |
| Primary      | `#3B82F6` | Thương hiệu, active navigation, tiến độ |
| Primary Dark | `#1D4ED8` | Hover, link, nhấn mạnh                  |
| Secondary    | `#8B5CF6` | Điểm nhấn, badge tím                    |
| Success      | `#16A34A` | Hoàn thành, đáp án đúng                 |
| Warning      | `#D97706` | Cảnh báo                                |
| Error        | `#DC2626` | Đáp án sai, lỗi                         |
| Background   | `#F8FAFC` | Nền website                             |
| Surface      | `#FFFFFF` | Card, panel                             |
| Text         | `#0F172A` | Nội dung chính                          |

Khoảng 70% giao diện dùng nền trắng/xám nhạt. Xanh dương cho CTA, liên kết và tiến độ; tím dùng hạn chế. Chữ thường cần tương phản tối thiểu 4.5:1; không chỉ dùng màu cho đúng/sai, kết hợp icon và văn bản. CTA có thể dùng sắc xanh đậm hơn Primary để bảo đảm tương phản với chữ trắng. Token dự phòng dark mode được chuẩn bị, chưa có công tắc giao diện tối.

### Font và kích thước

Inter là font chính; Nunito Sans là phương án thay thế, không cần tải cả hai. Font phục vụ cục bộ, gồm glyph tiếng Việt, latin và các weight 400/500/600/700/800. Fallback Segoe UI/sans-serif.

| Thành phần | Cỡ mục tiêu                                         | Weight  |
| ---------- | --------------------------------------------------- | ------- |
| H1         | 36–40px, responsive theo trang; hero có thể lớn hơn | 700     |
| H2         | 28–32px                                             | 700     |
| H3         | 20–24px                                             | 600     |
| Body       | 16px                                                | 400     |
| Button     | 14–16px                                             | 600     |
| Caption    | 12–14px                                             | 400–500 |
| Transcript | 17–18px; hỗ trợ phóng to                            | 400     |

Transcript line-height 1.7–1.8. Các card hoặc màn hình nhỏ có thể điều chỉnh heading phù hợp nhưng vẫn phải dễ đọc. Tiêu đề hiển thị nội dung thật, không dùng lorem ipsum.

### Spacing, bố cục và tương tác

- Hệ spacing 4px: 4, 8, 12, 16, 24, 32, 48px.
- Card bo 12–16px; input/button bo 8–12px.
- Border mảnh, shadow nhẹ; animation 150–250ms và hỗ trợ reduced motion.
- Nội dung tối đa khoảng 1200px; practice tối đa khoảng 960px.
- Tránh tràn ngang ở 360–390px, 768px và desktop.
- Có hover, focus-visible, disabled, loading/error khi phù hợp.
- Form có label; nút icon có accessible name; radio và range dùng được bằng bàn phím.
- Modal dùng native dialog để giữ focus và hỗ trợ Escape. Có skip link tới main.

## 5. Chức năng từng khu vực

### Trang chủ và thư viện

Trang chủ gồm hero, CTA vào thư viện hoặc thử bài nghe, giới thiệu lợi ích, thẻ chủ đề, bài gợi ý, hướng dẫn ba bước và CTA cuối trang. Thẻ bài có hình minh họa, tên, trình độ, chủ đề, thời lượng, dấu trang và nút bắt đầu nghe.

Tìm kiếm theo tên và mô tả, không phân biệt hoa/thường hoặc dấu tiếng Việt. Kết hợp được trình độ A1/A2/B1/B2 và chủ đề. Hiển thị số bài phù hợp, empty state và thao tác xóa bộ lọc. Chi tiết bài học hiển thị mục tiêu, số câu, transcript, lưu bài và bắt đầu luyện nghe.

### Luyện nghe

- Player thật: Play/Pause, tiến/lùi 10 giây, seek bằng thanh thời gian, tốc độ 0.5×–2×, âm lượng, thời lượng và thời gian hiện tại.
- Không tự phát audio khi mở trang. Có lỗi tải/phát và thao tác thử lại.
- Mỗi bài có câu hỏi trắc nghiệm; chọn đáp án, chuyển câu trước/sau hoặc nhảy bằng số thứ tự.
- Kiểm tra đáp án hiển thị đúng/sai và giải thích; đáp án đã kiểm tra được khóa cho tới khi làm lại.
- Phải trả lời đủ câu trước khi nộp. Modal xác nhận nộp; lưu lượt làm với điểm, câu trả lời, thời gian và thời điểm hoàn thành.
- Lưu bản nháp cục bộ; làm lại xóa bản nháp sau xác nhận nhưng giữ lịch sử đã nộp.
- Transcript mặc định đóng; có speaker, timestamp, highlight câu đang phát, nhấn vào câu để tua và tùy chọn chữ lớn.
- Audio và transcript là hai tài nguyên riêng gắn trong dữ liệu bài học.

### Kết quả, tiến độ và hồ sơ

Kết quả gồm phần trăm, số câu đúng, đáp án đã chọn/đúng, giải thích và CTA luyện lại hoặc chọn bài tiếp. Dashboard và progress tính từ lượt làm thật trên trình duyệt, không tạo thống kê giả. Biểu đồ đếm số lượt hoàn thành trong 7 ngày; lịch sử liên kết đến đúng lượt làm.

Bookmarks lưu/bỏ lưu ngay; tải lại trang vẫn giữ. Profile lưu tên/email. Settings lưu tốc độ, âm lượng, kích cỡ transcript và mục tiêu học mỗi ngày. Mục tiêu là tùy chọn cá nhân, chưa có nhắc học. Mọi dữ liệu này chỉ nằm trong trình duyệt, chưa đồng bộ và không phải tài khoản thật.

## 6. Component và cấu trúc mã nguồn

| Nhóm       | Component                                   | Ưu tiên    |
| ---------- | ------------------------------------------- | ---------- |
| Layout     | Header, Footer, Sidebar, Container          | Cao        |
| UI         | Button, Input, Card, Badge, Modal           | Cao        |
| Lesson     | LessonCard, LessonFilter, LevelBadge        | Cao        |
| Audio      | AudioPlayer, thanh thời gian, tốc độ        | Cao        |
| Exercise   | QuestionCard, radio choices, AnswerFeedback | Cao        |
| Transcript | TranscriptPanel, dòng có timestamp          | Cao        |
| Progress   | StatCard, ProgressChart                     | Trung bình |
| Feedback   | Loading, EmptyState, ErrorState, Toast      | Cao        |

Thành phần nhỏ như radio choice, feedback, playback speed và transcript line được compose trong component sở hữu, có thể tách file riêng khi tái sử dụng. Container hiện dùng class chung `.container`.

```text
public/assets/
  audio/{beginner,intermediate,advanced}/
  transcripts/
  images/{illustrations,thumbnails,avatars}/
  icons/
  fonts/
src/
  app/{router,providers}/
  layouts/
  components/{ui,layout,audio,exercises}/
  pages/
  features/{lessons,listening,progress}/
  data/mock/
  styles/{tokens.css,globals.css,typography.css}
  hooks/
  services/
  types/
  utils/
scripts/
tests/
```

## 7. Asset và dữ liệu

| Loại                | Quy chuẩn                                                                  |
| ------------------- | -------------------------------------------------------------------------- |
| Logo/icon           | SVG, nhất quán; Lucide ISC, không thêm icon library trùng                  |
| Minh họa            | SVG/WebP hoặc hình dựng bằng CSS/SVG nhất quán                             |
| Thumbnail           | WebP, tỷ lệ 16:9 khi dùng ảnh; hiện có minh họa SVG/CSS theo bài           |
| Avatar              | WebP/JPEG 1:1 khi có ảnh; hiện dùng chữ cái tên                            |
| Audio production    | MP3; tài nguyên lớn chuyển object storage/CDN                              |
| Audio demo hiện tại | WAV PCM mono 16kHz, sinh cục bộ từ Windows English speech voice            |
| Transcript          | JSON `{ start, end, speaker, text }[]`, đơn vị giây; có thể mở rộng WebVTT |
| Font                | WOFF2, hiện do @fontsource/inter đóng gói vào build                        |

6 bài mẫu: At the Coffee Shop, A Ticket to London, Making Weekend Plans, The Monday Meeting, A Little Bookshop, Rethinking Remote Work. Tổng 20 câu hỏi; 4 chủ đề: giao tiếp, du lịch, công việc, câu chuyện. Mức CEFR là nhãn minh họa, chưa được thẩm định chuyên môn.

Script `scripts/generate-audio.ps1` chứa nội dung demo gốc và sinh cả WAV/transcript theo vị trí PCM. Không cần chạy lại script để sử dụng website; các audio đã có trong public. Giọng tổng hợp một người đọc, không phải bản thu hội thoại nhiều diễn viên. Cần thay bằng audio được cấp phép và transcript được biên tập khi sản xuất.

Kiểu dữ liệu `Lesson`: id, slug, title, description, level, topic, duration, color, icon, audioUrl, transcriptUrl, questions. `Question`: id, prompt, options, answer (index bắt đầu từ 0), explanation. `Attempt`: id, lessonId, answers, score, total, completedAt, seconds. `Profile`: name, email, goal.

LocalStorage dùng prefix `listenup.`: bookmarks, attempts, profile, preferences, draft theo lessonId. Không lưu mật khẩu, token, dữ liệu nhạy cảm hay audio trong localStorage.

## 8. Tiêu chí nghiệm thu

1. Cài đặt được bằng npm, build TypeScript và Vite thành công.
2. Tất cả URL giai đoạn đầu có nội dung phù hợp; ID/slug sai có trạng thái không tìm thấy.
3. Từ thư viện đi qua bài học → practice → kết quả; đáp án đúng/sai được chấm chính xác kể cả option index 0.
4. Audio phát/tạm dừng, seek, tiến/lùi, tốc độ và âm lượng hoạt động; transcript khớp audio.
5. Filter, empty state, bookmark, profile, preferences và lịch sử hoạt động; refresh giữ dữ liệu cục bộ.
6. Responsive và bàn phím sử dụng được; text dễ đọc, focus rõ ràng, modal đóng được.
7. Không gây hiểu nhầm về đăng nhập thật, dữ liệu máy chủ hay tiến độ giả.
8. Có PROJECT_SPEC.md, AGENTS.md, TASKS.md và README hướng dẫn chạy, giới hạn, kiểm thử.

## 9. Vận hành và mở rộng

`npm install` (hoặc `npm ci` khi có lockfile), `npm run dev`, `npm test`, `npm run build`, `npm run preview`. Node 22.12+ hoặc Node 24; tuân theo engine của Vite/dependency trong lockfile. Bản build nằm trong dist. Static hosting phải rewrite URL ứng dụng về index.html; asset không tồn tại không nên rewrite thành HTML.

Sau frontend: chuẩn hóa API services, xác thực thật, lưu lượt làm PostgreSQL, object storage/CDN, CMS quản trị bài/audio/transcript, phân quyền, bộ nội dung có bản quyền, dark mode và bộ kiểm thử trình duyệt tự động. Không xuất bản hoặc triển khai hạ tầng trong phạm vi bộ khung local này.
