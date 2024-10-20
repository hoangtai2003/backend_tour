import jwt from 'jsonwebtoken'
export const verifyToken = (req, res, next) => {
    let token = req.cookies.accessToken;

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "You're not authorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }
        req.user = user; 
        next(); 
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

export const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        // Lấy danh sách quyền từ token của user
        const userPermissions = req.user.userRole?.rolePermission?.map(permission => permission.name) || [];
        console.log("User Permissions:", userPermissions); // Kiểm tra danh sách quyền

        // Kiểm tra xem user có quyền cần thiết không
        const hasPermission = userPermissions.includes(requiredPermission);

        if (hasPermission) {
            next(); // Nếu có quyền, tiếp tục middleware
        } else {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này." });
        }
    };
};