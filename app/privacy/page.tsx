"use client"
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Database, Users, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const dataTypes = [
    {
      icon: Users,
      title: "المعلومات الشخصية",
      description: "الاسم، البريد الإلكتروني، رقم الهاتف، العنوان"
    },
    {
      icon: Database,
      title: "بيانات الحساب",
      description: "اسم المستخدم، كلمة المرور، إعدادات الحساب"
    },
    {
      icon: Eye,
      title: "بيانات الاستخدام",
      description: "سجلات الدخول، نشاط الحساب، تفضيلات المستخدم"
    }
  ];

  const securityMeasures = [
    {
      icon: Lock,
      title: "تشفير البيانات",
      description: "جميع البيانات مشفرة باستخدام أحدث تقنيات التشفير"
    },
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "جدران حماية متطورة وحماية ضد جميع أنواع الهجمات"
    },
    {
      icon: Users,
      title: "وصول محدود",
      description: "وصول محدود للموظفين المصرح لهم فقط"
    }
  ];

  const policySections = [
    {
      title: "جمع المعلومات",
      content: "نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل أو استخدام خدماتنا. قد نجمّع أيضاً معلومات تلقائياً حول استخدامك لخدماتنا."
    },
    {
      title: "استخدام المعلومات",
      content: "نستخدم معلوماتك لتقديم خدماتنا، التواصل معك، تحسين خدماتنا، وضمان الأمان. لن نبيع أو نشارك معلوماتك مع أطراف ثالثة دون موافقتك."
    },
    {
      title: "حماية المعلومات",
      content: "نطبق إجراءات أمان صارمة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير."
    },
    {
      title: "مشاركة المعلومات",
      content: "نشارك معلوماتك فقط مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل خدماتنا، أو عندما يطلب القانون ذلك."
    },
    {
      title: "حقوقك",
      content: "لديك الحق في الوصول إلى معلوماتك، تصحيحها، حذفها، أو تقييد معالجتها. يمكنك ممارسة هذه الحقوق من خلال إعدادات حسابك."
    },
    {
      title: "التحديثات",
      content: "قد نحدث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار في موقعنا."
    }
  ];

  const additionalInfo = [
    "نحتفظ ببياناتك طالما كنت تستخدم خدماتنا",
    "يمكنك طلب حذف حسابك في أي وقت",
    "نستخدم ملفات تعريف الارتباط لتحسين تجربتك",
    "نحترم خصوصيتك ولن نراقب نشاطك الشخصي"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            سياسة الخصوصية
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-8 text-center shadow-2xl border border-sky-400/30">
              <Shield className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">التزامنا بحماية خصوصيتك</h2>
              <p className="text-sky-100 text-lg leading-relaxed">
                نعتبر خصوصيتك أولوية قصوى. نلتزم بحماية بياناتك الشخصية 
                وضمان أمانها وفقاً لأعلى معايير الصناعة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Types */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">أنواع البيانات التي نجمعها</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نوضح لك بالتفصيل أنواع البيانات التي نجمعها وكيفية استخدامها
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {dataTypes.map((type, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 text-center shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                <p className="text-sky-200 leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">إجراءات الأمان</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              نطبق إجراءات أمان صارمة لحماية بياناتك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {securityMeasures.map((measure, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 text-center shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <measure.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{measure.title}</h3>
                <p className="text-sky-200 leading-relaxed">{measure.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">تفاصيل السياسة</h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                سياسة خصوصية مفصلة وواضحة لجميع جوانب حماية بياناتك
              </p>
            </div>

            <div className="space-y-8">
              {policySections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 shadow-lg border border-sky-400/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                      <p className="text-sky-200 leading-relaxed text-lg">{section.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                نقاط مهمة حول خصوصيتك وحماية بياناتك
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
              هل لديك أسئلة حول الخصوصية؟
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              فريق الدعم متاح دائماً لمساعدتك في فهم سياسة الخصوصية والإجابة على أسئلتك
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

