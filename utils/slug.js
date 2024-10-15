export const createSlug = (news_name) => {
    return news_name
        .toLowerCase() // Chuyển chữ thành chữ thường
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
        .replace(/[Đđ]/g, 'd') // Chuyển Đ/đ thành d
        .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
        .trim() // Loại bỏ khoảng trắng ở đầu và cuối
        .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-'); // Loại bỏ các dấu gạch ngang dư thừa
};
