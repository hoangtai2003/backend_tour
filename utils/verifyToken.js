import jwt from 'jsonwebtoken'
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken

    // Nếu token không tồn tại 
    if (!token) {
        return res.status(401).json({success:false, message:"You're not authorize"})
    }
    //Sử dụng jwt.verify() để kiểm tra tính hợp lệ của token bằng khóa bí mật 
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({success:false, message:"Token is invalid"}) 
        }
        req.user = user //  Gán thông tin người dùng (từ token) vào đối tượng yêu cầu (req) để các phần khác của ứng dụng có thể truy cập.
        next()  // là một hàm được truyền vào middleware và có nhiệm vụ gọi middleware kế tiếp trong chuỗi xử lý yêu cầu.
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.role === "admin"){
            next()
        } else {
            return res.status(401).json({success:false, message:"You're not authenticated"}) 
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.role === "admin"){
            next()
        } else {
            return res.status(401).json({success:false, message:"You're not authorize"}) 
        }
    })
}