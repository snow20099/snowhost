"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setStatus('error');
      setMessage('رابط إعادة تعيين كلمة المرور غير صحيح');
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('كلمات المرور غير متطابقة');
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'فشل في إعادة تعيين كلمة المرور');
      }
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ أثناء إعادة تعيين كلمة المرور');
    }
  };

  if (status === 'error' && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-sky-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-white/90 mb-4">{message}</p>
              <Button 
                onClick={() => router.push('/forgot-password')}
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                طلب رابط جديد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-sky-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            إعادة تعيين كلمة المرور
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {status === 'success' ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
              <p className="text-white/90">{message}</p>
              <p className="text-sky-300 text-sm">سيتم توجيهك لصفحة تسجيل الدخول تلقائياً...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">
                  كلمة المرور الجديدة
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/10 border-sky-500/30 text-white placeholder:text-white/50"
                    placeholder="أدخل كلمة المرور الجديدة"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 border-sky-500/30 text-white placeholder:text-white/50"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {message && (
                <Alert className={status === 'error' ? 'border-red-500 bg-red-500/10' : 'border-green-500 bg-green-500/10'}>
                  <AlertDescription className={status === 'error' ? 'text-red-400' : 'text-green-400'}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
              >
                {status === 'loading' ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/login')}
                  className="text-sky-300 hover:text-sky-200"
                >
                  العودة لتسجيل الدخول
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 