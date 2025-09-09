"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "info@snowhost.com",
      description: "راسلنا عبر البريد الإلكتروني"
    },
    {
      icon: Phone,
      title: "الهاتف",
      value: "+966 50 123 4567",
      description: "اتصل بنا مباشرة"
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      description: "مقر الشركة الرئيسي"
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      value: "24/7",
      description: "متاحون على مدار الساعة"
    }
  ];

  const faqItems = [
    {
      question: "كيف يمكنني البدء في استخدام خدماتكم؟",
      answer: "يمكنك التسجيل في موقعنا واختيار الباقة المناسبة لك، ثم إنشاء حساب Pterodactyl الخاص بك."
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل جميع طرق الدفع الرئيسية بما في ذلك البطاقات الائتمانية والمدفوعات الإلكترونية."
    },
    {
      question: "هل تقدمون دعم فني؟",
      answer: "نعم، نقدم دعم فني متخصص على مدار الساعة لمساعدتك."
    },
    {
      question: "ما هو ضمان وقت التشغيل؟",
      answer: "نضمن 99.9% من وقت التشغيل لجميع خدماتنا مع تعويض في حالة عدم الالتزام."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black">
      {/* Header Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            اتصل بنا
          </h1>
          <p className="text-xl md:text-2xl text-sky-200 max-w-3xl mx-auto leading-relaxed">
            نحن هنا لمساعدتك. اتصل بنا بأي طريقة تفضلها
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 text-center shadow-lg border border-sky-400/30 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                <div className="text-sky-300 font-medium mb-2">{method.value}</div>
                <p className="text-sky-200 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">أرسل لنا رسالة</h2>
              <p className="text-xl text-sky-200 max-w-2xl mx-auto">
                املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-3xl p-8 shadow-2xl border border-sky-400/30">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white font-medium mb-2 block">
                      الاسم الكامل
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white font-medium mb-2 block">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-white font-medium mb-2 block">
                    الموضوع
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400"
                    placeholder="أدخل موضوع الرسالة"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-white font-medium mb-2 block">
                    الرسالة
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-sky-800/30 border-sky-400/50 text-white placeholder-sky-300 focus:border-sky-400 focus:ring-sky-400 resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <div className="text-center">
                  <Button type="submit" size="lg" className="bg-sky-600 hover:bg-sky-700 text-white">
                    <Send className="h-5 w-5 mr-2" />
                    إرسال الرسالة
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">لماذا تختار سنو هوست؟</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">دعم فني متخصص</h3>
                    <p className="text-sky-200">فريق دعم متخصص متاح على مدار الساعة لمساعدتك</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">خدمات عالية الجودة</h3>
                    <p className="text-sky-200">نقدم أفضل خدمات الاستضافة مع ضمان الجودة</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">أسعار منافسة</h3>
                    <p className="text-sky-200">أسعار عادلة ومنافسة لجميع خدماتنا</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-8 text-center">
              <MessageSquare className="h-16 w-16 text-white mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">دردشة مباشرة</h3>
              <p className="text-sky-100 mb-6">
                احصل على مساعدة فورية من خلال الدردشة المباشرة مع فريق الدعم
              </p>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-sky-600">
                بدء الدردشة
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">الأسئلة الشائعة</h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-800/50 to-sky-900/50 rounded-2xl p-6 border border-sky-400/30"
              >
                <h3 className="text-xl font-bold text-white mb-3">{item.question}</h3>
                <p className="text-sky-200 leading-relaxed">{item.answer}</p>
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
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-sky-600">
                  عرض الأسعار
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

