import { router as auth } from 'router/auth'
import { router as api } from 'router/api'
import { router as payment } from 'router/payment'

export default [ 
    {
        prefix: "/auth",
        router: auth,
        description: "endpoint dùng cho đăng nhập/đăng kí",
        api: {
            "/auth/login": {
                "method": "GET",
                "description": "api login, chuyển hướng đến login qua google"
            },
            "/google/callback": {
                "method": "GET",
                "description": "nhận token và thông tin xác thực từ google sau khi user login",
                "addition": {
                    "note": "Hidden api do not call!"
                }
            },
            "/auth/loginWithEmail": {
                "method": "POST",
                "description": "login với email và mật khẩu",
                "addition": {
                    "require body": "email and password"
                }
            }
        }
    },
    {
        prefix: "/payment",
        router: payment,
        description: "endpoint dùng cho thanh toán",
        api: {
            "/payment/callback": {
                "method": "POST",
                "description": "callback của zalopay server",
                "addition": {
                    "Note": "Hidden api, do not call!"
                }
            }, 
            "/payment/createOrder": {
                "method": "GET",
                "description": "api tạo thông tin thanh toán",
                "addition": {
                    "require url params": "email"
                }
            }
        }
    },
    {
        prefix: "/api",
        router: api,
        description: "endpoint dùng cho api chung chung - yêu cầu token trong header",
        api: {
            "/api/logOut": {
                "method": "GET",
                "description": "api để đăng xuất, lưu tạm token vào redis tới khi hết hạn"
            }, 
            "/api/info": {
                "method": "GET",
                "description": "lấy thông tin cơ bản"
            }, 
            "/api/chat": {
                "method": "POST",
                "description": "api gửi tin nhắn đến bot, yêu cầu token trong header",
                "addition": {
                    "require body": {
                        "message": "string"
                    }
                }
            }, 
            "/api/recent": {
                "method": "GET",
                "description": "api lấy danh sách tin nhắn đã gửi, yêu cầu token trong header",
            }, 
            "/api/changePassword": {
                "method": "PATCH",
                "description": "api đổi mật khẩu",
                addition: {
                    "require body": "newPassword:string"
                }
            }
        }
    }
]