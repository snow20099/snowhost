"use client"
import { Button } from "@/components/ui/button";
import { Users, Target, Award, Heart, Globe, Zap, Shield, Headphones } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "1000+", label: "عميل راضي", icon: Users },
    { number: "99.9%", label: "وقت التشغيل", icon: Target },
    { number: "5+", label: "سنوات خبرة", icon: Award },
    { number: "24/7", label: "دعم فني", icon: Headphones }
  ];

  const values = [
    {
      icon: Heart,
      title: "الموثوقية",
      description: "نضع ثقة عملائنا في المقام الأول ونعمل بجد لضمان رضاهم التام"
    },
    {
      icon: Shield,
      title: "الأمان",
      description: "نضمن أمان بيانات عملائنا مع أحدث تقنيات الحماية والتشفير"
    },
    {
      icon: Zap,
      title: "الابتكار",
      description: "نستمر في تطوير خدماتنا وتحديث تقنياتنا لتقديم الأفضل دائماً"
    },
    {
      icon: Globe,
      title: "الشمولية",
      description: "نخدم عملاءنا من جميع أنحاء العالم مع دعم متعدد اللغات"
    }
  ];

  const team = [
    {
      name: "أحمد محمد",
      position: "المدير التنفيذي",
      description: "خبرة 10+ سنوات في مجال الاستضافة والتكنولوجيا"
    },
    {
      name: "سارة أحمد",
      position: "مدير التطوير",
      description: "متخصصة في تطوير البنية التحتية وتحسين الأداء"
    },
    {
      name: "محمد علي",
      position: "مدير الدعم الفني",
      description: "فريق دعم متخصص مع خبرة في حل المشاكل التقنية"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            من نحن
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            تعرف على قصة سنو هوست ورحلتنا في تقديم أفضل خدمات الاستضافة
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sky-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">قصتنا ورؤيتنا</h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                بدأت رحلتنا في عام 2019 بهدف واحد: تقديم أفضل خدمات الاستضافة
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">بدايتنا</h3>
                <p className="text-sky-200 mb-6 leading-relaxed">
                  بدأنا كفريق صغير من المطورين المتحمسين الذين يؤمنون بقوة التكنولوجيا في تغيير العالم. 
                  رأينا أن هناك حاجة لخدمات استضافة موثوقة وبأسعار معقولة للشركات والأفراد.
                </p>
                <p className="text-sky-200 leading-relaxed">
                  اليوم، نحن نفخر بخدمة آلاف العملاء من جميع أنحاء العالم، ونواصل تطوير خدماتنا 
                  لتلبية احتياجاتهم المتزايدة.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">رؤيتنا</h3>
                <p className="text-sky-200 mb-6 leading-relaxed">
                  نطمح لأن نكون الشركة الرائدة في مجال خدمات الاستضافة، مع التركيز على الابتكار 
                  والجودة والموثوقية. نريد أن نجعل التكنولوجيا متاحة للجميع.
                </p>
                <p className="text-sky-200 leading-relaxed">
                  نؤمن بأن كل عميل يستحق تجربة استضافة استثنائية، ونعمل بجد لضمان رضاهم التام 
                  من خلال خدمات عالية الجودة ودعم فني متميز.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">قيمنا</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              القيم التي تقود عملنا وتشكل هويتنا كشركة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-float">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-sky-200 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">فريقنا</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              تعرف على الفريق المتميز الذي يقف وراء نجاح سنو هوست
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-8 text-center shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <div className="text-sky-300 font-medium mb-4">{member.position}</div>
                <p className="text-sky-200 leading-relaxed">{member.description}</p>
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
              انضم إلى عائلة سنو هوست
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              اكتشف بنفسك لماذا يختار آلاف العملاء سنو هوست لاحتياجاتهم
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

