# Asset ListenUp

- `audio/beginner`, `audio/intermediate`, `audio/advanced`: WAV demo có sẵn. Production ưu tiên MP3 và CDN/object storage.
- `transcripts`: JSON độc lập gồm start/end theo giây, speaker và text. Phải khớp audio cùng ID.
- `icons`: logo SVG; icon UI dùng Lucide React.
- `images/illustrations`, `images/thumbnails`, `images/avatars`: chỗ cho asset chính thức; hiện dùng minh họa CSS/SVG và avatar chữ cái.
- `fonts`: chỗ cho font custom về sau. Inter hiện do @fontsource/inter tự đóng gói vào dist/assets.

Không thêm asset thiếu quyền sử dụng. Khi đổi audio, cập nhật transcript và duration trong dữ liệu bài rồi chạy npm test.
