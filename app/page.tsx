"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Zap, Clock, Headphones, Award, Globe, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Hero Section with Image Background */}
      <section id="hero" className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/snow-host-hero.jpg"
            alt="SnowHost Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 via-sky-800/70 to-black/90"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              استضافة خوادم
              <br />
              <span className="text-sky-300 bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">
                الألعاب المتطورة
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-sky-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              احصل على أفضل تجربة استضافة للعبة مع أداء عالي ودعم 24/7
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-sky-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-400/30">
                <Shield className="h-5 w-5 text-sky-300" />
                <span className="text-white font-medium">حماية متقدمة</span>
              </div>
              <div className="flex items-center gap-2 bg-sky-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-400/30">
                <Zap className="h-5 w-5 text-sky-300" />
                <span className="text-white font-medium">سرعة فائقة</span>
              </div>
              <div className="flex items-center gap-2 bg-sky-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-400/30">
                <Clock className="h-5 w-5 text-sky-300" />
                <span className="text-white font-medium">دعم 24/7</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard/services/gaming">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white animate-pulse">
                  ابدأ الآن
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </Button>
                </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-sky-300 text-sky-300 hover:bg-sky-800/30">
                  عرض الأسعار
              </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-sky-400/30">
              <p className="text-sky-200 mb-4">يثق بنا أكثر من</p>
              <div className="flex justify-center items-center gap-8 text-2xl font-bold text-sky-300">
                <span>+1000</span>
                <span className="text-sky-400/50">|</span>
                <span>عميل</span>
                <span className="text-sky-400/50">|</span>
                <span>99.9%</span>
                <span className="text-sky-200 text-lg">وقت التشغيل</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Snow Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-sky-300 rounded-full opacity-60 animate-snowfall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-sky-800 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">خدماتنا</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من خدمات الاستضافة لجميع احتياجاتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Gaming Hosting */}
            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 p-6 rounded-xl border border-sky-400/30 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">استضافة الألعاب</h3>
              <p className="text-sky-200 mb-4">خوادم عالية الأداء لجميع أنواع الألعاب</p>
              <Link href="/dashboard/services/gaming">
                <Button variant="outline" size="sm" className="w-full border-sky-400 text-sky-300 hover:bg-sky-800/30">
                  ابدأ الآن
                </Button>
              </Link>
            </div>

            {/* VPS Hosting */}
            <div className="bg-gradient-to-br from-green-800/50 to-green-900/50 p-6 rounded-xl border border-green-400/30 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">☁️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">استضافة VPS</h3>
              <p className="text-green-200 mb-4">خوادم افتراضية خاصة مع أداء عالي</p>
              <div className="opacity-60 cursor-not-allowed">
                <Button variant="outline" size="sm" className="w-full border-green-400/50 text-green-400/50" disabled>
                  قريباً
                </Button>
              </div>
            </div>

            {/* Web Hosting */}
            <div className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 p-6 rounded-xl border border-purple-400/30 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🌐</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">استضافة الويب</h3>
              <p className="text-purple-200 mb-4">استضافة مواقع الويب مع أداء محسن</p>
              <div className="opacity-60 cursor-not-allowed">
                <Button variant="outline" size="sm" className="w-full border-purple-400/50 text-purple-400/50" disabled>
                  قريباً
                </Button>
              </div>
            </div>

            {/* Dedicated Hosting */}
            <div className="bg-gradient-to-br from-orange-800/50 to-orange-900/50 p-6 rounded-xl border border-orange-400/30 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">استضافة مخصصة</h3>
              <p className="text-orange-200 mb-4">خوادم مخصصة بالكامل لاحتياجاتك</p>
              <div className="opacity-60 cursor-not-allowed">
                <Button variant="outline" size="sm" className="w-full border-orange-400/50 text-orange-400/50" disabled>
                  قريباً
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              لماذا تختار سنو هوست؟
            </h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نتميز بتقديم أفضل الخدمات مع ضمان الجودة والأمان والموثوقية
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-600/30 group">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-3 w-fit mb-4 group-hover:animate-float">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                حماية متقدمة
              </h3>
              <p className="text-sky-200 leading-relaxed">
                حماية شاملة ضد جميع أنواع الهجمات مع جدران حماية متطورة وتشفير SSL
              </p>
          </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-600/30 group">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-3 w-fit mb-4 group-hover:animate-float">
                <Zap className="h-6 w-6 text-white" />
        </div>
              <h3 className="text-xl font-bold text-white mb-3">
                أداء فائق
              </h3>
              <p className="text-sky-200 leading-relaxed">
                خوادم عالية السرعة مع SSD سريع وبنية تحتية متطورة لضمان أفضل أداء
              </p>
        </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-600/30 group">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-3 w-fit mb-4 group-hover:animate-float">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                دعم فني متميز
              </h3>
              <p className="text-sky-200 leading-relaxed">
                فريق دعم متخصص متاح على مدار الساعة لمساعدتك في أي وقت تحتاج فيه
            </p>
          </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-600/30 group">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-3 w-fit mb-4 group-hover:animate-float">
                <Award className="h-6 w-6 text-white" />
          </div>
              <h3 className="text-xl font-bold text-white mb-3">
                جودة عالية
              </h3>
              <p className="text-sky-200 leading-relaxed">
                نلتزم بأعلى معايير الجودة مع ضمان 99.9% من وقت التشغيل
              </p>
        </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-600/30 group">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-3 w-fit mb-4 group-hover:animate-float">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                تغطية عالمية
              </h3>
              <p className="text-sky-200 leading-relaxed">
                خوادم موزعة في مواقع استراتيجية حول العالم لضمان سرعة استجابة عالية
            </p>
          </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-600/30 group">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-3 w-fit mb-4 group-hover:animate-float">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                خصوصية وأمان
              </h3>
              <p className="text-sky-200 leading-relaxed">
                حماية كاملة لبياناتك مع سياسات خصوصية صارمة وتشفير متقدم
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-2xl p-8 shadow-xl border border-sky-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  +1000
                </div>
                <div className="text-sky-100 font-medium">
                  عميل راضي
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  99.9%
                </div>
                <div className="text-sky-100 font-medium">
                  وقت التشغيل
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  24/7
                </div>
                <div className="text-sky-100 font-medium">
                  دعم فني
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  5 سنوات
                </div>
                <div className="text-sky-100 font-medium">
                  خبرة
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-16 bg-gradient-to-br from-sky-800 to-sky-900 rounded-2xl p-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-xl md:text-2xl font-medium mb-6 italic">
                "سنو هوست هي الخيار الأفضل لاستضافة الألعاب. الخدمة ممتازة والدعم الفني سريع وفعال. أنصح الجميع بالتجربة!"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-sky-600/50 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">أ</span>
                </div>
                <div className="text-left rtl:text-right">
                  <div className="font-semibold">أحمد محمد</div>
                  <div className="text-sky-200">مطور ألعاب</div>
        </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

