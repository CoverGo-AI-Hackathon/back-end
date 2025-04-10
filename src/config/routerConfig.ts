import { router as auth } from 'router/auth'
import { router as api } from 'router/api/api'

export default [ 
    {
        prefix: "/auth",
        router: auth,
        description: "endpoint dùng cho đăng nhập/đăng kí",
        api: {
            "/auth/login": {
                "method": "GET",
                "description": "api login, chuyển hướng đến login qua google"
            }
        }
    },
    {
        prefix: "/api",
        router: api,
        description: "endpoint dùng cho api chung chung",
        api: {
            "/api/logOut": {
                "method": "GET",
                "description": "api để đăng xuất, lưu tạm token vào redis tới khi hết hạn"
            }
        }
    }
]