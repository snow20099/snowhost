"use client"
import { Button } from "@/components/ui/button";
import { Zap, Shield, Headphones, Clock, Globe, Server, Cpu, Database, Lock, Wifi, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Zap,
      title: "أداء فائق",
      description: "خوادم عالية السرعة مع SSD سريع وبنية تحتية متطورة لضمان أفضل أداء",
      details: ["معالجات حديثة", "ذاكرة عالية السرعة", "شبكة محسنة", "تخزين سريع"]
    },
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "حماية شاملة ضد جميع أنواع الهجمات مع جدران حماية متطورة",
      details: ["حماية DDoS", "جدران حماية ذكية", "تشفير SSL", "مراقبة مستمرة"]
    },
    {
      icon: Headphones,
      title: "دعم فني متميز",
      description: "فريق دعم متخصص متاح على مدار الساعة لمساعدتك في أي وقت",
      details: ["دعم 24/7", "فريق متخصص", "رد سريع", "حلول فعالة"]
    },
    {
      icon: Clock,
      title: "99.9% وقت التشغيل",
      description: "ضمان وقت تشغيل عالي لجميع خدماتنا مع مراقبة مستمرة",
      details: ["مراقبة مستمرة", "صيانة وقائية", "نسخ احتياطية", "استرداد سريع"]
    }
  ];

  const technicalFeatures = [
    {
      icon: Server,
      title: "خوادم عالية الأداء",
      description: "خوادم حديثة مع أحدث التقنيات لضمان أفضل أداء"
    },
    {
      icon: Cpu,
      title: "معالجات متطورة",
      description: "معالجات حديثة وسريعة لجميع احتياجاتك"
    },
    {
      icon: Database,
      title: "تخزين سريع",
      description: "SSD سريع مع نسخ احتياطية تلقائية"
    },
    {
      icon: Lock,
      title: "أمان متقدم",
      description: "حماية شاملة مع تشفير متقدم"
    },
    {
      icon: Wifi,
      title: "شبكة محسنة",
      description: "اتصال إنترنت عالي السرعة مع انخفاض في الكمون"
    },
    {
      icon: BarChart3,
      title: "مراقبة مستمرة",
      description: "مراقبة 24/7 لجميع الخوادم والخدمات"
    }
  ];

  const performanceMetrics = [
    { metric: "99.9%", label: "وقت التشغيل" },
    { metric: "<10ms", label: "كمون منخفض" },
    { metric: "1000+", label: "عميل راضي" },
    { metric: "24/7", label: "دعم فني" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            مميزاتنا
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            اكتشف لماذا يختار آلاف العملاء سنو هوست لاحتياجاتهم
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">المميزات الرئيسية</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من المميزات المتقدمة لضمان أفضل تجربة استضافة
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 shadow-2xl border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-float">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sky-200 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-3 text-sky-100">
                      <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">المميزات التقنية</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              بنية تحتية متطورة مع أحدث التقنيات لضمان الأداء الأمثل
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {technicalFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-xl p-6 shadow-lg border border-sky-600/30 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-float">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sky-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-12 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">أرقام تتحدث عن نفسها</h2>
              <p className="text-xl text-sky-100 max-w-2xl mx-auto">
                إحصائيات حقيقية تثبت جودة خدماتنا
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {metric.metric}
                  </div>
                  <div className="text-sky-100 font-medium">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">مميزات متقدمة</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              تقنيات متطورة لضمان الأمان والأداء والموثوقية
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 border border-sky-400/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">إدارة متقدمة</h3>
              </div>
              <ul className="space-y-3 text-sky-200">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  لوحة تحكم سهلة الاستخدام
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  مراقبة الأداء في الوقت الفعلي
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  إعدادات مخصصة
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  تقارير مفصلة
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 border border-sky-400/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">أمان متقدم</h3>
              </div>
              <ul className="space-y-3 text-sky-200">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  حماية DDoS متقدمة
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  تشفير SSL مجاني
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  جدران حماية ذكية
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                  نسخ احتياطية تلقائية
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              جاهز لاختبار هذه المميزات؟
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              انضم إلينا الآن واحصل على أفضل تجربة استضافة مع جميع هذه المميزات
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/services/gaming">
                <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50">
                  ابدأ الآن
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-sky-600">
                  اتصل بنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

