"use client"

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Menu, 
  X, 
  Globe, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings,
  Snowflake
} from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navigation = [
    { name: 'الرئيسية', href: '/', en: 'Home' },
    { name: 'الخدمات', href: '/services', en: 'Services' },
    { name: 'الأسعار', href: '/pricing', en: 'Pricing' },
    { name: 'المميزات', href: '/features', en: 'Features' },
    { name: 'من نحن', href: '/about', en: 'About' },
    { name: 'اتصل بنا', href: '/contact', en: 'Contact' },
    { name: 'الدعم', href: '/support', en: 'Support' }
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 w-full bg-black border-b border-sky-700 z-50 font-tajawal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Snowflake className="h-8 w-8 text-sky-300 animate-float" />
              <span className="text-xl font-bold text-white">سنو هوست</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-sky-400'
                    : 'text-gray-300 hover:text-sky-400'
                }`}
              >
                {language === 'ar' ? item.name : item.en}
          </Link>
            ))}
          </nav>

          {/* Right Side - Controls & User */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-300 hover:text-sky-400 transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-sky-400 transition-colors"
              title={theme === 'light' ? 'Switch to Dark' : 'التبديل إلى الفاتح'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-sky-600 rounded-full animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:text-sky-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block text-sm">
                    {session.user?.name || session.user?.email}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-sky-700 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-sky-600 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-sky-600 hover:text-white transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                </div>
              )}
                </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm border border-sky-600 text-sky-400 hover:bg-sky-600 hover:text-white transition-colors rounded-lg"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm bg-sky-600 hover:bg-sky-700 text-white transition-colors rounded-lg"
                >
                  التسجيل
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-sky-400 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
              </div>
              
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-sky-700">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-sky-400'
                      : 'text-gray-300 hover:text-sky-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {language === 'ar' ? item.name : item.en}
                    </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
