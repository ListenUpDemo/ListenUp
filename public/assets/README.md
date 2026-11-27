# Asset ListenUp

- `audio/beginner`, `audio/intermediate`, `audio/advanced`: WAV demo có sẵn. Production ưu tiên MP3 và CDN/object storage.
- `transcripts`: JSON độc lập gồm start/end theo giây, speaker và text. Phải khớp audio cùng ID.
- `icons`: logo SVG; icon UI dùng Lucide React.
- `images/illustrations`, `images/thumbnails`, `images/avatars`: chỗ cho asset chính thức; hiện dùng minh họa CSS/SVG và avatar chữ cái.
- `fonts`: chỗ cho font custom về sau. Inter hiện do @fontsource/inter tự đóng gói vào dist/assets.
- `adventure/hero-*.png`: khung đứng và đi của Male Hero Free, cắt từ sprite sheet do người dùng cung cấp. Tác giả Ozzbit Games. Giấy phép bản Free cho phép sửa đổi và dùng cá nhân, phi thương mại, yêu cầu ghi công và cấm bán lại dưới dạng asset hoặc NFT.
- `adventure/cat-*.png`: khung đứng và đi của sáu mẫu trong Pet Cats Pack do người dùng cung cấp. Gói dùng giấy phép CC0.

Không thêm asset thiếu quyền sử dụng. Khi đổi audio, cập nhật transcript và duration trong dữ liệu bài rồi chạy npm test.
