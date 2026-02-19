# 🚀 Quick Start - Memory Wall Builder

## Lần đầu setup

```bash
# 1. Cài đặt dependencies
npm install

# 2. Build site lần đầu
npm run build

# 3. Mở xem kết quả
open public/index.html
```

## Thêm năm mới (ví dụ: năm 2027)

### 1️⃣ Thêm hình ảnh

```bash
# Tạo folder năm mới
mkdir images-source/2027

# Copy hình vào với tên: 2027-1.jpg, 2027-2.jpg, 2027-3.jpg, ...
```

### 2️⃣ Cập nhật config

Mở file `src/config.json` và thêm:

```json
{
  "memories": [
    {
      "year": 2027,
      "post": "Một năm nữa trôi qua, chúng ta lại sum họp bên nhau...",
      "author": "Tên Bạn"
    },
    // ... các năm cũ ở dưới
  ]
}
```

### 3️⃣ Build lại

```bash
npm run build
```

### 4️⃣ Xong! 🎉

File HTML mới đã được tạo trong `public/index.html`

## Deploy

Deploy toàn bộ folder `public/` lên:
- GitHub Pages
- Netlify
- Vercel
- Hoặc bất kỳ static hosting nào

## Troubleshooting

**Lỗi khi build?**
```bash
# Cài lại dependencies
rm -rf node_modules package-lock.json
npm install
```

**Hình không hiển thị?**
- Kiểm tra hình có trong `images-source/[năm]/`
- Kiểm tra tên file: `[năm]-1.jpg`, `[năm]-2.jpg`
- Build lại: `npm run build`

---

✨ Đơn giản vậy thôi!
