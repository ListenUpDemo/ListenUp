# Đặc tả dự án ListenUp

## 1. Mục tiêu và phạm vi

ListenUp là website luyện Listening tiếng Anh theo chủ đề RPG phiêu lưu. Người học đi qua các ải, giải câu hỏi bằng cách nghe hội thoại, thu vàng và mở khóa trang bị. Giao diện chính dùng tiếng Việt. Nội dung hội thoại, transcript và câu hỏi dùng tiếng Anh. Giải thích đáp án dùng tiếng Việt.

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
| `/`                                        | Bản đồ chiến dịch, ải hằng ngày và thông tin sinh mệnh, vàng | PublicLayout    |
| `/lessons`                                 | Thư viện, tìm kiếm và lọc trình độ/chủ đề        | PublicLayout    |
| `/lessons/:slug`                           | Chi tiết bài học, lưu bài, bắt đầu luyện nghe    | PublicLayout    |
| `/practice/:lessonId`                      | Ải luyện nghe từ một bài trong thư viện          | LearningLayout  |
| `/practice/:lessonId/result`               | Điểm, đáp án, giải thích và luyện lại            | LearningLayout  |
| `/adventure/campaign/:campaignId`          | Ải chiến dịch theo chủ đề và trình độ            | LearningLayout  |
| `/adventure/daily`                         | Ải luyện tập theo ngày                           | LearningLayout  |
| `/shop`                                    | Mua, bảo dưỡng và trang bị vật phẩm hoặc pet     | PublicLayout    |
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

Header dẫn đến Bản đồ ải, Bài học, Cửa hàng và Góc học tập, với nút vào Ải hằng ngày. Sidebar chia điều hướng khám phá và cá nhân. Mobile có menu mở/đóng và thanh điều hướng góc học tập cuộn ngang.

## 4. Hệ thống giao diện

### Màu sắc

| Token        | Màu       | Công dụng                               |
| ------------ | --------- | --------------------------------------- |
| Primary      | `#315D48` | Nút chính, điều hướng, tiến độ          |
| Primary Dark | `#224737` | Hover, link, nhấn mạnh                  |
| Secondary    | `#835025` | Điểm nhấn nâu ấm                        |
| Success      | `#16A34A` | Hoàn thành, đáp án đúng                 |
| Warning      | `#D97706` | Cảnh báo                                |
| Error        | `#DC2626` | Đáp án sai, lỗi                         |
| Background   | `#F7F4E9` | Nền giấy sáng                           |
| Surface      | `#FFFCF4` | Card, panel                             |
| Text         | `#23352D` | Nội dung chính                          |
| RPG Gold     | `#EBBD68` | Điểm nhấn trên bản đồ tối               |

Bản đồ dùng nền rừng tối, phong cảnh CSS và sprite pixel chuyển động. Màn hình đọc, nghe và trả lời dùng nền sáng. Chữ thường cần tương phản tối thiểu 4.5:1. Phản hồi đúng/sai kết hợp icon và văn bản.

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

Trang chủ hiển thị sinh mệnh, vàng, đường vào cửa hàng, ải hằng ngày và bản đồ chiến dịch. Thẻ bài trong thư viện có hình minh họa, tên, trình độ, chủ đề, thời lượng, dấu trang và nút bắt đầu nghe.

Tìm kiếm theo tên và mô tả, không phân biệt hoa/thường hoặc dấu tiếng Việt. Kết hợp được trình độ A1/A2/B1/B2 và chủ đề. Hiển thị số bài phù hợp, empty state và thao tác xóa bộ lọc. Chi tiết bài học hiển thị mục tiêu, số câu, transcript, lưu bài và bắt đầu luyện nghe.

### Luyện nghe

- Player thật: Play/Pause, tiến/lùi 10 giây, seek bằng thanh thời gian, tốc độ 0.5×–2×, âm lượng, thời lượng và thời gian hiện tại.
- Không tự phát audio khi mở trang. Có lỗi tải/phát và thao tác thử lại.
- Trả lời lần lượt các chặng. Khi chặng được phân định, khóa câu trả lời và hiển thị đúng/sai cùng giải thích tiếng Việt. Khi khiên đỡ một đòn, tiếp tục trả lời cùng chặng với lựa chọn sai đã bị loại.
- Lưu tiến độ, lựa chọn hiện tại và phần thưởng sau mỗi thao tác. Sau chặng cuối, mở rương và hoàn thành ải để lưu lượt làm của từng bài với điểm, đáp án, thời gian và thời điểm hoàn thành.
- Có thể chơi lại ải chiến dịch hoặc ải một bài. Lịch sử đã hoàn thành vẫn có thể xem lại.
- Transcript mặc định đóng; có speaker, timestamp, highlight câu đang phát, nhấn vào câu để tua và tùy chọn chữ lớn.
- Audio và transcript là hai tài nguyên riêng gắn trong dữ liệu bài học.

### Ải, sinh mệnh và trang bị

- Mỗi cặp chủ đề và trình độ có nội dung là một ải chiến dịch. Hoàn thành mọi ải của chủ đề được tính là hoàn thành chủ đề. Bộ bài của ải hằng ngày luân phiên theo ngày trên thiết bị, gồm ba bài mẫu và có thể hoàn thành một lần mỗi ngày. Ải vào từ thư viện không mở khóa tiến trình chiến dịch.
- Một chặng hiện là một câu trắc nghiệm. Mô hình chặng có trường `kind` để mở rộng tương tác. Sprite nhà thám hiểm di chuyển theo chặng, cùng một pet nếu đã sở hữu và trang bị.
- Tối đa 5 sinh mệnh, tự hồi 1 mỗi 10 phút theo mốc thời gian đã lưu. Sai mà khiên không đỡ mất 1 sinh mệnh. Khi hết sinh mệnh, chặng chưa trả lời tạm dừng cho đến khi hồi hoặc dùng thuốc đã trang bị.
- Mỗi chặng đã phân định cho 15 vàng, kể cả chặng sai. Kiếm còn độ bền cộng 20%, 40% hoặc 60% vàng theo loại và mất 1 độ bền. Khiên còn độ bền tự đỡ một câu sai nếu còn hơn hai lựa chọn, loại câu sai và mất 1 độ bền. Kiếm và khiên hết độ bền vẫn thuộc kho và có thể bảo dưỡng với giá thấp hơn giá mua.
- Một lượt vào ải giữ một loại thuốc, một khiên, một kiếm và một pet theo bộ trang bị tại thời điểm bắt đầu. Thuốc tiêu hao theo từng lọ và hồi 1–5 sinh mệnh theo độ hiếm.
- Rương giữa ải cho một lọ thuốc với độ hiếm ngẫu nhiên. Rương cuối rút một kiếm hoặc khiên từ nhóm đã mở khóa hiện tại. Mở lần đầu nhận vật phẩm, mở trùng khôi phục độ bền tối đa. Mỗi rương của lượt chỉ mở một lần.
- Cửa hàng bán thuốc, bán và bảo dưỡng trang bị, bán pet theo tiến trình hoàn thành chủ đề. Vàng khởi đầu bằng 0 và kiếm được khi giải các chặng.

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

LocalStorage dùng prefix `listenup.`. Khóa `listenup.adventure.v1` chứa sinh mệnh, vàng, kho, trang bị, tiến độ chặng và lịch sử mới. Lịch sử cũ từ `listenup.attempts` được đọc cùng lịch sử RPG. Bản nháp từ trình luyện cũ không chuyển sang chặng RPG. Dữ liệu cá nhân hiện có tiếp tục dùng các khóa bookmarks, profile và preferences.

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
