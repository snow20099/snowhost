"use client"
import { Button } from "@/components/ui/button";
import { Server, Gamepad2, Cloud, Globe, Zap, Shield, Headphones, Clock } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      icon: Gamepad2,
      title: "استضافة الألعاب",
      description: "خوادم عالية الأداء لجميع أنواع الألعاب مع دعم فني متخصص",
      features: ["ماينكرافت", "فايف إم", "ARK", "Discord Bot"],
      status: "متاح",
      href: "/dashboard/services/gaming",
      color: "from-sky-600 to-sky-700"
    },
    {
      icon: Cloud,
      title: "استضافة VPS",
      description: "خوادم افتراضية خاصة مع أداء عالي ومرونة في الإدارة",
      features: ["Linux", "Windows", "SSD سريع", "إدارة كاملة"],
      status: "قريباً",
      href: "#",
      color: "from-green-600 to-green-700",
      disabled: true
    },
    {
      icon: Server,
      title: "استضافة مخصصة",
      description: "خوادم مخصصة بالكامل لاحتياجاتك الخاصة",
      features: ["أداء عالي", "مرونة كاملة", "دعم مخصص", "أمان متقدم"],
      status: "قريباً",
      href: "#",
      color: "from-purple-600 to-purple-700",
      disabled: true
    },
    {
      icon: Globe,
      title: "استضافة الويب",
      description: "استضافة مواقع الويب مع أداء محسن وأمان عالي",
      features: ["WordPress", "cPanel", "SSL مجاني", "نسخ احتياطية"],
      status: "قريباً",
      href: "#",
      color: "from-orange-600 to-orange-700",
      disabled: true
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "أداء فائق",
      description: "خوادم عالية السرعة مع SSD سريع وبنية تحتية متطورة"
    },
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "حماية شاملة ضد جميع أنواع الهجمات مع جدران حماية متطورة"
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      description: "فريق دعم متخصص متاح على مدار الساعة لمساعدتك"
    },
    {
      icon: Clock,
      title: "99.9% وقت التشغيل",
      description: "ضمان وقت تشغيل عالي لجميع خدماتنا"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            خدماتنا
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من خدمات الاستضافة لجميع احتياجاتك
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${service.color} rounded-2xl p-8 shadow-2xl border border-sky-400/30 hover:scale-105 transition-all duration-300 ${
                  service.disabled ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    service.status === 'متاح' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {service.status}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-sky-100 mb-6 leading-relaxed">{service.description}</p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">المميزات:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sky-200">
                        <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {service.disabled ? (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-white/30 text-white/50 cursor-not-allowed" 
                    disabled
                  >
                    قريباً
                  </Button>
                ) : (
                  <Link href={service.href}>
                    <Button size="lg" className="w-full bg-white text-sky-600 hover:bg-sky-50">
                      ابدأ الآن
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">لماذا تختار سنو هوست؟</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نتميز بتقديم أفضل الخدمات مع ضمان الجودة والأمان والموثوقية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
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
              جاهز لبدء رحلتك معنا؟
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف العملاء الراضين واحصل على أفضل تجربة استضافة
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