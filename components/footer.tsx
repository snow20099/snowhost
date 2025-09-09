"use client"

import { Snowflake, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const quickLinks = [
    { name: 'الرئيسية', href: "/" },
    { name: 'الخدمات', href: "/services" },
    { name: 'الأسعار', href: "/pricing" },
    { name: 'المميزات', href: "/features" },
    { name: 'من نحن', href: "/about" },
    { name: 'اتصل بنا', href: "/contact" }
  ];

  const services = [
    { name: 'استضافة الألعاب', href: "/dashboard/services/gaming" },
    { name: 'استضافة VPS', href: "/services" },
    { name: 'استضافة مخصصة', href: "/services" },
    { name: 'استضافة الويب', href: "/services" }
  ];

  const legal = [
    { name: 'الشروط والأحكام', href: "/terms" },
    { name: 'سياسة الخصوصية', href: "/privacy" },
    { name: 'ملفات تعريف الارتباط', href: "/cookies" }
  ];

  const support = [
    { name: 'الدعم الفني', href: "/support" },
    { name: 'الأسئلة الشائعة', href: "/support" },
    { name: 'اتصل بنا', href: "/contact" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "فيسبوك" },
    { icon: Twitter, href: "#", name: "تويتر" },
    { icon: Instagram, href: "#", name: "إنستغرام" },
    { icon: Linkedin, href: "#", name: "لينكد إن" }
  ];

  return (
    <footer className="bg-gradient-to-br from-sky-600 via-sky-800 to-black text-white border-t border-sky-700 font-tajawal">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Snowflake className="h-8 w-8 text-sky-300 animate-float" />
              <span className="text-2xl font-bold text-white">سنو هوست</span>
            </div>
            <p className="text-sky-100 mb-6 leading-relaxed">
              نقدم أفضل خدمات الاستضافة مع ضمان الجودة والأمان. نحن نؤمن بأن كل عميل يستحق تجربة استضافة استثنائية.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sky-200">
                <Phone className="h-5 w-5 text-sky-300" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sky-200">
                <Mail className="h-5 w-5 text-sky-300" />
                <span>info@snowhost.com</span>
              </div>
              <div className="flex items-center gap-3 text-sky-200">
                <MapPin className="h-5 w-5 text-sky-300" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">روابط سريعة</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sky-200 hover:text-sky-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">خدماتنا</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="text-sky-200 hover:text-sky-300 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">قانوني</h3>
            <ul className="space-y-3 mb-6">
              {legal.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-sky-200 hover:text-sky-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-bold mb-4 text-white">الدعم</h3>
            <ul className="space-y-3 mb-6">
              {support.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-sky-200 hover:text-sky-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white">تابعنا</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-sky-700/50 rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors group"
                    title={social.name}
                  >
                    <social.icon className="h-5 w-5 text-sky-200 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sky-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sky-200 text-center md:text-right">
              © {new Date().getFullYear()} سنو هوست. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 text-sm text-sky-200">
              <span>99.9% وقت التشغيل</span>
              <span>دعم 24/7</span>
              <span>حماية SSL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

