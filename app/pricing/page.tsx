"use client"
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Shield, Headphones } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "الباقة الأساسية",
      price: "29",
      period: "شهرياً",
      description: "مثالية للاعبين المبتدئين",
      features: [
        "2GB RAM",
        "20GB SSD",
        "1 CPU Core",
        "دعم فني أساسي",
        "نسخ احتياطية أسبوعية",
        "حماية DDoS أساسية"
      ],
      popular: false,
      color: "from-sky-600 to-sky-700"
    },
    {
      name: "الباقة المتقدمة",
      price: "59",
      period: "شهرياً",
      description: "مثالية للاعبين المحترفين",
      features: [
        "4GB RAM",
        "50GB SSD",
        "2 CPU Cores",
        "دعم فني متقدم",
        "نسخ احتياطية يومية",
        "حماية DDoS متقدمة",
        "أولوية في الدعم"
      ],
      popular: true,
      color: "from-sky-500 to-sky-600"
    },
    {
      name: "الباقة الاحترافية",
      price: "99",
      period: "شهرياً",
      description: "مثالية للفرق والمنظمات",
      features: [
        "8GB RAM",
        "100GB SSD",
        "4 CPU Cores",
        "دعم فني متميز",
        "نسخ احتياطية مستمرة",
        "حماية DDoS احترافية",
        "أولوية قصوى في الدعم",
        "إدارة مخصصة"
      ],
      popular: false,
      color: "from-sky-700 to-sky-800"
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "حماية شاملة ضد جميع أنواع الهجمات مع جدران حماية متطورة"
    },
    {
      icon: Zap,
      title: "أداء فائق",
      description: "خوادم عالية السرعة مع SSD سريع وبنية تحتية متطورة"
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      description: "فريق دعم متخصص متاح على مدار الساعة لمساعدتك"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            باقات استضافة الألعاب
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            اختر الباقة المناسبة لاحتياجاتك واحصل على أفضل تجربة استضافة للألعاب
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${plan.color} rounded-2xl p-8 shadow-2xl border border-sky-400/30 hover:scale-105 transition-all duration-300 ${
                  plan.popular ? 'ring-4 ring-sky-300 ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      الأكثر شعبية
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sky-200 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <span className="text-xl text-sky-200 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-sky-300 mt-0.5 flex-shrink-0" />
                      <span className="text-sky-100">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard/services/gaming">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-white text-sky-600 hover:bg-sky-50' 
                        : 'bg-sky-300 text-sky-900 hover:bg-sky-200'
                    }`}
                    size="lg"
                  >
                    ابدأ الآن
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">مميزات إضافية</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نقدم لك مجموعة من المميزات المتقدمة لضمان أفضل تجربة استضافة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {additionalFeatures.map((feature, index) => (
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
              انضم إلى آلاف العملاء الراضين واحصل على أفضل تجربة استضافة للألعاب
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

