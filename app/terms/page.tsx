"use client"
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, FileText, Clock, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const termsSections = [
    {
      title: "قبول الشروط",
      content: "باستخدام خدماتنا، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يجوز لك استخدام خدماتنا."
    },
    {
      title: "وصف الخدمات",
      content: "نقدم خدمات استضافة للألعاب والمواقع الإلكترونية والخوادم الافتراضية. نحتفظ بالحق في تعديل أو إيقاف أي خدمة في أي وقت."
    },
    {
      title: "استخدام الخدمات",
      content: "يجب استخدام خدماتنا فقط للأغراض القانونية. يحظر استخدام الخدمات لأي نشاط غير قانوني أو ضار أو يسيء للآخرين."
    },
    {
      title: "المسؤولية",
      content: "نحن مسؤولون عن صيانة البنية التحتية للخوادم، ولكن لا نتحمل المسؤولية عن المحتوى الذي ينشئه المستخدمون."
    },
    {
      title: "الخصوصية",
      content: "نلتزم بحماية خصوصية عملائنا. راجع سياسة الخصوصية الخاصة بنا لفهم كيفية جمع واستخدام معلوماتك."
    },
    {
      title: "التعديلات",
      content: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني."
    }
  ];

  const importantPoints = [
    "يجب أن تكون 18 عاماً أو أكثر لاستخدام خدماتنا",
    "نحتفظ بالحق في رفض الخدمة لأي سبب",
    "يجب دفع جميع الرسوم في الوقت المحدد",
    "نحتفظ بالحق في تعليق الحسابات المخالفة",
    "جميع الخدمات تخضع لضمان وقت التشغيل 99.9%"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            الشروط والأحكام
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-8 text-center shadow-2xl border border-yellow-400/30">
              <AlertTriangle className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">تنبيه مهم</h2>
              <p className="text-yellow-100 text-lg leading-relaxed">
                باستخدام خدمات سنو هوست، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
                يرجى قراءتها بعناية قبل المتابعة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">الشروط والأحكام</h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                هذه الشروط تحكم استخدامك لخدمات سنو هوست
              </p>
            </div>

            <div className="space-y-8">
              {termsSections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 shadow-lg border border-sky-400/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
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

      {/* Important Points */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">نقاط مهمة</h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                يرجى الانتباه إلى هذه النقاط المهمة
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-3xl p-8 shadow-2xl border border-sky-400/30">
              <div className="grid md:grid-cols-2 gap-6">
                {importantPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-sky-400 mt-1 flex-shrink-0" />
                    <span className="text-sky-100 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">معلومات إضافية</h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                معلومات مهمة حول استخدام خدماتنا
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 text-center shadow-lg border border-sky-400/30">
                <Clock className="h-12 w-12 text-sky-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">مدة الخدمة</h3>
                <p className="text-sky-200">
                  جميع الخدمات متاحة على مدار الساعة مع ضمان 99.9% من وقت التشغيل
                </p>
              </div>

              <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 text-center shadow-lg border border-sky-400/30">
                <Users className="h-12 w-12 text-sky-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">دعم العملاء</h3>
                <p className="text-sky-200">
                  فريق دعم متخصص متاح على مدار الساعة لمساعدتك في أي مشكلة
                </p>
              </div>

              <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 text-center shadow-lg border border-sky-400/30">
                <Shield className="h-12 w-12 text-sky-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">الأمان</h3>
                <p className="text-sky-200">
                  نضمن أمان بياناتك مع أحدث تقنيات الحماية والتشفير
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              هل لديك أسئلة حول الشروط؟
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              فريق الدعم متاح دائماً لمساعدتك في فهم هذه الشروط والإجابة على أسئلتك
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

