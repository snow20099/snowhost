"use client"
import { Button } from "@/components/ui/button";
import { Cookie, Settings, Shield, Eye, Trash2, Globe, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CookiesPage() {
  const cookieTypes = [
    {
      icon: Shield,
      title: "ملفات تعريف الارتباط الأساسية",
      description: "ضرورية لتشغيل الموقع بشكل صحيح",
      examples: ["جلسة المستخدم", "تفضيلات اللغة", "إعدادات الأمان"]
    },
    {
      icon: Eye,
      title: "ملفات تعريف الارتباط التحليلية",
      description: "تساعدنا في فهم كيفية استخدام الموقع",
      examples: ["إحصائيات الزيارات", "سلوك المستخدم", "أداء الموقع"]
    },
    {
      icon: Settings,
      title: "ملفات تعريف الارتباط الوظيفية",
      description: "تحسن تجربة المستخدم والوظائف",
      examples: ["تفضيلات المستخدم", "إعدادات الحساب", "الميزات المتقدمة"]
    }
  ];

  const cookieManagement = [
    {
      icon: Globe,
      title: "إعدادات المتصفح",
      description: "يمكنك تعديل إعدادات ملفات تعريف الارتباط في متصفحك"
    },
    {
      icon: Settings,
      title: "لوحة التحكم",
      description: "تحكم في ملفات تعريف الارتباط من خلال إعدادات حسابك"
    },
    {
      icon: Trash2,
      title: "حذف الملفات",
      description: "احذف ملفات تعريف الارتباط الموجودة في أي وقت"
    }
  ];

  const browserSettings = [
    {
      browser: "Chrome",
      steps: [
        "افتح إعدادات Chrome",
        "اذهب إلى الخصوصية والأمان",
        "اختر ملفات تعريف الارتباط وبيانات المواقع الأخرى",
        "اضبط الإعدادات حسب رغبتك"
      ]
    },
    {
      browser: "Firefox",
      steps: [
        "افتح إعدادات Firefox",
        "اذهب إلى الخصوصية والأمان",
        "اختر ملفات تعريف الارتباط وبيانات المواقع",
        "اضبط الإعدادات حسب رغبتك"
      ]
    },
    {
      browser: "Safari",
      steps: [
        "افتح تفضيلات Safari",
        "اذهب إلى الخصوصية",
        "اختر إدارة بيانات المواقع",
        "اضبط الإعدادات حسب رغبتك"
      ]
    }
  ];

  const additionalInfo = [
    "نستخدم ملفات تعريف الارتباط لتحسين تجربتك",
    "لا تحتوي على معلومات شخصية حساسة",
    "يمكنك تعطيلها في أي وقت",
    "نحترم تفضيلاتك حول الخصوصية"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            سياسة ملفات تعريف الارتباط
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            تعرف على كيفية استخدامنا لملفات تعريف الارتباط وكيفية التحكم فيها
          </p>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-8 text-center shadow-2xl border border-sky-400/30">
              <Cookie className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">ما هي ملفات تعريف الارتباط؟</h2>
              <p className="text-sky-100 text-lg leading-relaxed max-w-3xl mx-auto">
                ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. 
                تساعدنا في توفير تجربة أفضل وتفهم كيفية استخدامك للموقع.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">أنواع ملفات تعريف الارتباط</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نستخدم أنواعاً مختلفة من ملفات تعريف الارتباط لأغراض مختلفة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {cookieTypes.map((type, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                <p className="text-sky-200 mb-4">{type.description}</p>
                <div className="space-y-2">
                  {type.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center gap-2 text-sky-100 text-sm">
                      <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">إدارة ملفات تعريف الارتباط</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              لديك سيطرة كاملة على ملفات تعريف الارتباط
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cookieManagement.map((method, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 text-center shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                <p className="text-sky-200 leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browser Settings */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">إعدادات المتصفح</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              تعرف على كيفية تعديل إعدادات ملفات تعريف الارتباط في متصفحك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {browserSettings.map((browser, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 shadow-lg border border-sky-400/30"
              >
                <h3 className="text-xl font-bold text-white mb-4 text-center">{browser.browser}</h3>
                <ol className="space-y-3">
                  {browser.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3 text-sky-200">
                      <span className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">معلومات إضافية</h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                نقاط مهمة حول ملفات تعريف الارتباط وخصوصيتك
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-3xl p-8 shadow-2xl border border-sky-400/30">
              <div className="grid md:grid-cols-2 gap-6">
                {additionalInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-sky-400 mt-1 flex-shrink-0" />
                    <span className="text-sky-100 leading-relaxed">{info}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              هل لديك أسئلة حول ملفات تعريف الارتباط؟
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              فريق الدعم متاح دائماً لمساعدتك في فهم سياسة ملفات تعريف الارتباط
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50">
                  اتصل بنا
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-sky-600">
                  الدعم الفني
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

