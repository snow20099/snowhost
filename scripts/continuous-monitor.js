#!/usr/bin/env node

/**
 * 🕐 سكربت مراقبة مستمرة للخوادم المنتهية
 * يعمل في الخلفية ويقوم بإيقاف الخوادم المنتهية تلقائياً
 */

const https = require('https');
const http = require('http');

// إعدادات المراقبة
const MONITOR_INTERVAL = 5 * 60 * 1000; // كل 5 دقائق
const API_ENDPOINT = process.env.MONITOR_API_URL || 'https://yourdomain.com/api/monitor/auto-suspend';
const MONITOR_SECRET = process.env.MONITOR_SECRET || 'your-monitor-secret';

console.log('🚀 Starting continuous server monitor...');
console.log(`📡 API Endpoint: ${API_ENDPOINT}`);
console.log(`⏰ Check Interval: ${MONITOR_INTERVAL / 1000 / 60} minutes`);

/**
 * فحص وإيقاف الخوادم المنتهية
 */
async function checkAndSuspendExpiredServers() {
  const timestamp = new Date().toISOString();
  console.log(`\n🕐 [${timestamp}] Starting server expiry check...`);

  try {
    const url = new URL(API_ENDPOINT);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Server-Monitor/1.0',
        'Accept': 'application/json'
      }
    };

    const protocol = url.protocol === 'https:' ? https : http;

    const request = protocol.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (response.statusCode === 200) {
            console.log(`✅ [${timestamp}] Monitor check completed successfully`);
            console.log(`📊 Summary:`, result.summary);
            
            if (result.summary.totalSuspended > 0) {
              console.log(`🚨 Suspended ${result.summary.totalSuspended} expired servers`);
            }
          } else {
            console.error(`❌ [${timestamp}] Monitor check failed:`, result.error);
          }
        } catch (parseError) {
          console.error(`❌ [${timestamp}] Failed to parse response:`, parseError.message);
        }
      });
    });

    request.on('error', (error) => {
      console.error(`❌ [${timestamp}] Request error:`, error.message);
    });

    request.on('timeout', () => {
      console.error(`⏰ [${timestamp}] Request timeout`);
      request.destroy();
    });

    request.setTimeout(30000); // 30 seconds timeout
    request.end();

  } catch (error) {
    console.error(`❌ [${timestamp}] Error in monitor check:`, error.message);
  }
}

/**
 * بدء المراقبة المستمرة
 */
function startContinuousMonitoring() {
  console.log('🔄 Starting continuous monitoring...');
  
  // تشغيل الفحص الأول فوراً
  checkAndSuspendExpiredServers();
  
  // تشغيل الفحص كل فترة محددة
  setInterval(checkAndSuspendExpiredServers, MONITOR_INTERVAL);
  
  console.log('✅ Continuous monitoring started successfully');
  console.log('💡 Press Ctrl+C to stop monitoring');
}

/**
 * معالجة إيقاف البرنامج
 */
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server monitor...');
  console.log('👋 Monitor stopped successfully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, stopping monitor...');
  console.log('👋 Monitor stopped successfully');
  process.exit(0);
});

/**
 * معالجة الأخطاء غير المتوقعة
 */
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.log('🔄 Restarting monitor in 10 seconds...');
  
  setTimeout(() => {
    console.log('🔄 Restarting monitor...');
    startContinuousMonitoring();
  }, 10000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// بدء المراقبة
startContinuousMonitoring(); 