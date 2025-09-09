"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('رابط التحقق غير صحيح');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          
          // Create Pterodactyl account after successful verification
          try {
            await createPterodactylAccount(data.userId);
          } catch (pterodactylError) {
            console.error('Failed to create Pterodactyl account:', pterodactylError);
            // Don't show error to user, just log it
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'فشل في التحقق من البريد الإلكتروني');
        }
      } catch (error) {
        setStatus('error');
        setMessage('حدث خطأ أثناء التحقق من البريد الإلكتروني');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const createPterodactylAccount = async (userId: string) => {
    try {
      // Get user data from MongoDB
      const userResponse = await fetch(`/api/user/profile?userId=${userId}`);
      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }
      
      const userData = await userResponse.json();
      
      // Create Pterodactyl account
      const pterodactylData = {
        username: userData.username,
        email: userData.email,
        first_name: userData.name.split(' ')[0] || userData.name,
        last_name: userData.name.split(' ').slice(1).join(' ') || '',
        password: userData.originalPassword || 'SnowHost123!' // Use original password from registration
      };
      
      const pterodactylRes = await fetch("/api/pterodactyl/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pterodactylData),
      });

      if (pterodactylRes.ok) {
        console.log('Pterodactyl account created successfully');
      } else {
        console.error('Failed to create Pterodactyl account');
      }
    } catch (error) {
      console.error('Error creating Pterodactyl account:', error);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-sky-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {status === 'loading' && 'جاري التحقق...'}
            {status === 'success' && 'تم التحقق بنجاح'}
            {status === 'error' && 'فشل في التحقق'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            {status === 'loading' && (
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 text-sky-400 animate-spin" />
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-400" />
              </div>
            )}
            
            <p className="mt-4 text-white/90 text-center">
              {message}
            </p>
          </div>

          {status === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={handleGoToLogin}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
              >
                تسجيل الدخول
              </Button>
              <Button 
                onClick={handleGoToHome}
                variant="outline"
                className="w-full border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white"
              >
                العودة للرئيسية
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={handleGoToHome}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
              >
                العودة للرئيسية
              </Button>
              <Button 
                onClick={handleGoToLogin}
                variant="outline"
                className="w-full border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white"
              >
                تسجيل الدخول
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 