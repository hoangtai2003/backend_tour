import jwt from 'jsonwebtoken'
export const verifyToken = (req, res, next) => {
    let token = req.cookies.accessToken; // Lấy token từ cookie

    // Nếu không tìm thấy trong cookie, kiểm tra Authorization header
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]; // Lấy token từ header
    }

    // Nếu không tìm thấy token ở cả cookie lẫn header
    if (!token) {
        return res.status(401).json({ success: false, message: "You're not authorized" });
    }

    // Sử dụng jwt.verify() để kiểm tra tính hợp lệ của token bằng khóa bí mật
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }
        req.user = user; // Gán thông tin người dùng từ token vào req
        next(); // Tiếp tục tới middleware tiếp theo
    });
};


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