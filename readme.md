# Node version: v22.14.0

# Run Source
```bash
npm run dev
```

or

```bash
npm run build && npm run start
```

# Install express nodeJS
- npm install express
- npm install -D typescript @types/express ts-node-dev
- npx tsc --init


# Ghi Chú
### Trong khi refresh token:
- Nếu user đã đổi mật khẩu trước trước -> refresh thất bại
- Khác fingerprint -> refresh thất bại
- email / password không khớp -> refresh thất bại