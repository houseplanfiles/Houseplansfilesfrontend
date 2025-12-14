import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import WishlistPanel from "@/components/WishlistPanel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { logout } from "@/lib/features/users/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { state: cartState } = useCart();
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.user);

  const isUserAllowed =
    userInfo &&
    ["user", "admin", "professional", "seller"].includes(userInfo.role);

  const showCartAndWishlist = !userInfo || userInfo?.role === "user";

  const getDashboardPath = () => {
    if (!userInfo) return "/login";
    switch (userInfo.role) {
      case "seller":
        return "/seller";
      case "professional":
        return "/professional";
      case "admin":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/login");
  };

  // Optimization: Throttled Scroll Handler for Better INP/Main Thread Performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow =
      isMenuOpen || isWishlistOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen, isWishlistOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ready Made House Plan", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "City Partner", path: "/city-partners" },
    { name: "Career", path: "/careers" },
    { name: "Package", path: "/packages" },
    { name: "Gallery", path: "/gallery" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const displayName = userInfo?.name || userInfo?.businessName || "User";
  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-200"
            : "bg-white border-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                {/* LCP Optimization: fetchPriority high and explicit dimensions to prevent CLS */}
                <img
                  src="/logo1.png"
                  alt="ArchHome Logo"
                  width="180"
                  height="56"
                  className="h-14 w-auto object-contain"
                  // @ts-ignore
                  fetchPriority="high"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden xl:flex items-center gap-5 mx-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[15px] font-medium relative transition-colors duration-300 group whitespace-nowrap ${
                    isActive(link.path)
                      ? "text-orange-600"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-[-4px] left-0 w-full h-0.5 bg-orange-500 transition-transform duration-300 origin-center ${
                      isActive(link.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="hidden md:flex items-center gap-4 border-r border-gray-200 pr-4 mr-1">
                {showCartAndWishlist && (
                  <>
                    <button
                      onClick={() => setIsWishlistOpen(true)}
                      className="relative text-gray-600 hover:text-orange-600 transition-colors p-1"
                      aria-label="Wishlist"
                    >
                      <Heart className="w-6 h-6" />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                    <Link
                      to="/cart"
                      className="relative text-gray-600 hover:text-orange-600 transition-colors p-1"
                      aria-label="Cart"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {cartState.items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {cartState.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                      )}
                    </Link>
                  </>
                )}
              </div>

              {/* User / Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
                {isUserAllowed ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 outline-none">
                        <Avatar className="w-10 h-10 border-2 border-orange-100 hover:border-orange-500 transition-colors">
                          <AvatarFallback className="bg-orange-500 text-white font-bold">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-sm">
                          <span className="font-semibold text-gray-800 leading-tight max-w-[100px] truncate">
                            {displayName}
                          </span>
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to={getDashboardPath()}>
                        <DropdownMenuItem className="cursor-pointer py-2">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/login">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 shadow-md shadow-orange-500/20">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        variant="outline"
                        className="rounded-full border-orange-500 text-orange-600 hover:bg-orange-50 px-6"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="xl:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="text-gray-700 hover:text-orange-600 transition-colors p-1"
                  aria-label="Open Menu"
                >
                  <Menu className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-50 xl:hidden backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 z-[60] bg-white w-[85%] max-w-sm p-6 xl:hidden flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 flex-shrink-0">
                {/* Mobile Menu Logo Optimization */}
                <img
                  src="/logo1.png"
                  alt="Logo"
                  width="120"
                  height="40"
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <nav className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`text-lg font-medium p-4 rounded-xl transition-all ${
                        isActive(link.path)
                          ? "bg-orange-50 text-orange-600 translate-x-2 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="border-t pt-6 mt-4 flex-shrink-0 space-y-4">
                {showCartAndWishlist && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Link
                      to="/cart"
                      className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg text-gray-700 font-medium"
                    >
                      <ShoppingCart size={18} /> Cart ({cartState.items.length})
                    </Link>
                    <button
                      onClick={() => setIsWishlistOpen(true)}
                      className="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg text-gray-700 font-medium"
                    >
                      <Heart size={18} /> Wishlist ({wishlistItems.length})
                    </button>
                  </div>
                )}

                {isUserAllowed ? (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="w-10 h-10 border-2 border-orange-500">
                          <AvatarFallback className="bg-orange-500 text-white font-bold">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500">
                            View Dashboard
                          </p>
                        </div>
                      </Link>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full h-10"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg rounded-xl shadow-lg shadow-orange-200">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-6 text-lg rounded-xl"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WishlistPanel
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;
