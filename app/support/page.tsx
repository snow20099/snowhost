"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Phone, Mail, FileText, Video, BookOpen, HelpCircle, ChevronRight, Clock, Users, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const supportChannels = [
    {
      icon: MessageSquare,
      title: "دردشة مباشرة",
      description: "احصل على مساعدة فورية من فريق الدعم",
      response: "خلال دقائق",
      color: "from-sky-500 to-sky-600"
    },
    {
      icon: Phone,
      title: "الهاتف",
      description: "اتصل بنا مباشرة للحصول على دعم فوري",
      response: "خلال دقائق",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      description: "أرسل لنا رسالة وسنرد عليك قريباً",
      response: "خلال ساعتين",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const helpResources = [
    {
      icon: FileText,
      title: "الدليل الشامل",
      description: "دليل مفصل لجميع خدماتنا وكيفية استخدامها",
      href: "#"
    },
    {
      icon: Video,
      title: "فيديوهات تعليمية",
      description: "مقاطع فيديو توضيحية لجميع العمليات",
      href: "#"
    },
    {
      icon: BookOpen,
      title: "المعرفة",
      description: "مقالات ومعلومات مفيدة حول الاستضافة",
      href: "#"
    }
  ];

  const commonIssues = [
    {
      category: "مشاكل الاتصال",
      issues: [
        "لا يمكنني الوصول إلى الخادم",
        "بطء في الاتصال",
        "انقطاع في الخدمة"
      ]
    },
    {
      category: "مشاكل الحساب",
      issues: [
        "نسيت كلمة المرور",
        "لا يمكنني تسجيل الدخول",
        "مشاكل في الفواتير"
      ]
    },
    {
      category: "مشاكل تقنية",
      issues: [
        "خطأ في إعدادات الخادم",
        "مشاكل في النسخ الاحتياطي",
        "أخطاء في التطبيقات"
      ]
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "دعم 24/7",
      description: "فريق دعم متاح على مدار الساعة لمساعدتك"
    },
    {
      icon: Users,
      title: "خبراء متخصصون",
      description: "فريق من الخبراء في مجال الاستضافة والتكنولوجيا"
    },
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "حماية شاملة لجميع خدماتك وبياناتك"
    },
    {
      icon: Zap,
      title: "رد سريع",
      description: "رد سريع على جميع استفساراتك ومشاكلك"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            الدعم الفني
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            نحن هنا لمساعدتك في حل جميع مشاكلك التقنية
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">كيف يمكننا مساعدتك؟</h2>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-sky-400" />
              <Input
                type="text"
                placeholder="ابحث عن حل لمشكلتك..."
                className="w-full pl-4 pr-12 py-4 text-lg bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400 rounded-2xl"
              />
            </div>
            <p className="text-sky-200 mt-4">ابحث في قاعدة المعرفة أو اختر من القائمة أدناه</p>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">قنوات الدعم</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              اختر الطريقة التي تفضلها للتواصل مع فريق الدعم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportChannels.map((channel, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 text-center shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float`}>
                  <channel.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{channel.title}</h3>
                <p className="text-sky-200 mb-4">{channel.description}</p>
                <div className="inline-flex items-center gap-2 bg-sky-700/50 px-4 py-2 rounded-full">
                  <Clock className="h-4 w-4 text-sky-300" />
                  <span className="text-sky-200 text-sm font-medium">{channel.response}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">موارد المساعدة</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              اكتشف مجموعة من الموارد المفيدة لمساعدتك في حل مشاكلك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {helpResources.map((resource, index) => (
              <Link key={index} href={resource.href}>
                <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                    <resource.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{resource.title}</h3>
                  <p className="text-sky-200 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-center text-sky-300 group-hover:text-sky-200 transition-colors">
                    <span className="text-sm font-medium">استكشف الآن</span>
                    <ChevronRight className="h-4 w-4 mr-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">المشاكل الشائعة</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              حلول سريعة لأكثر المشاكل شيوعاً
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {commonIssues.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 shadow-lg border border-sky-400/30"
              >
                <h3 className="text-xl font-bold text-white mb-6 text-center">{category.category}</h3>
                <ul className="space-y-3">
                  {category.issues.map((issue, issueIndex) => (
                    <li key={issueIndex} className="flex items-center gap-3 text-sky-200 hover:text-sky-100 transition-colors cursor-pointer">
                      <HelpCircle className="h-4 w-4 text-sky-400 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">مميزات الدعم</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نقدم لك أفضل خدمة دعم فني في مجال الاستضافة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 text-center shadow-lg border border-sky-600/30 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sky-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              هل تحتاج مساعدة إضافية؟
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              فريق الدعم متاح دائماً لمساعدتك في حل جميع مشاكلك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50">
                  اتصل بنا
                </Button>
              </Link>
              <Link href="/dashboard/services/gaming">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-sky-600">
                  ابدأ الآن
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

