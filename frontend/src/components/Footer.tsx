import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2F2F2F] text-[#F4EDE4] border-t border-[#6B4F3A]/40 pt-14 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#C8A97E] mb-4">
            Bookstore
          </h2>
          <p className="text-[#F4EDE4]/80 leading-relaxed">
            Kho tri thức – nơi những cuốn sách trở thành giá trị.
          </p>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-6">
            {[FaFacebookF, FaInstagram, FaTwitter, FaGithub].map((Icon, i) => (
              <a
                key={i}
                className="p-2 bg-[#6B4F3A]/20 rounded-full hover:bg-[#6B4F3A]/40 transition text-[#C8A97E]"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-xl font-bold text-[#C8A97E] mb-4">Danh mục</h3>
          <ul className="space-y-2">
            <li><Link to="/books" className="hover:text-[#C8A97E]">Sách mới</Link></li>
            <li><Link to="/categories" className="hover:text-[#C8A97E]">Thể loại</Link></li>
            <li><Link to="/authors" className="hover:text-[#C8A97E]">Tác giả nổi bật</Link></li>
            <li><Link to="/best-seller" className="hover:text-[#C8A97E]">Bán chạy</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-xl font-bold text-[#C8A97E] mb-4">Hỗ trợ</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy-policy" className="hover:text-[#C8A97E]">Chính sách bảo mật</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-[#C8A97E]">Điều khoản</Link></li>
            <li><Link to="/faq" className="hover:text-[#C8A97E]">Câu hỏi thường gặp</Link></li>
            <li><Link to="/contact" className="hover:text-[#C8A97E]">Liên hệ hỗ trợ</Link></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-xl font-bold text-[#C8A97E] mb-4">
            Nhận thông báo sách mới
          </h3>
          <p className="text-[#F4EDE4]/80 mb-3">
            Đăng ký để nhận tin sách giảm giá & ra mắt.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="px-4 py-2 w-full bg-[#F4EDE4] text-gray-900 rounded-l-lg outline-none"
            />
            <button className="bg-[#6B4F3A] hover:bg-[#593F2D] px-4 py-2 rounded-r-lg text-white font-semibold transition">
              Gửi
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-[#6B4F3A]/30 text-center text-[#F4EDE4]/70">
        © {new Date().getFullYear()} Bookstore của Nhân Tuấn — Made with ❤️.
      </div>
    </footer>
  );
};

export default Footer;
