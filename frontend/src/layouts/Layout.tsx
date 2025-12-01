import Footer from "../components/Footer";
import Header from "../components/Header";
interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#2f2f2f]">
      <Header />
      <div className="container mx-auto py-10 flex-1 bg-[#3a3a3a]">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
