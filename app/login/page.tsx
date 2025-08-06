import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const pterodactylApiKey = Deno.env.get('PTERODACTYL_API_KEY') || 'ptla_abH8F0flwqZPNpOKXx4uAfVWFJUPFrC7N5bHEHiRS9y';
const pterodactylApiUrl = 'https://panel.snowhost.cloud/api';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateServerRequest {
  name: string;
  email: string;
  ram: number; // RAM in MB
  disk: number; // Disk in MB
  planId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, ram, disk, planId } = await req.json() as CreateServerRequest;

    // Create user in Pterodactyl if not exists
    const pterodactylUser = await createPterodactylUser(email);
    if (!pterodactylUser) {
      throw new Error('Failed to create user in Pterodactyl');
    }

    // Create server in Pterodactyl
    const server = await createPterodactylServer(name, pterodactylUser.id, ram, disk);
    if (!server) {
      throw new Error('Failed to create server in Pterodactyl');
    }

    // Get user_id from Supabase auth by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      throw new Error('User not found in database');
    }

    // Add server to user_servers table
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const { data: userServer, error: serverError } = await supabase
      .from('user_servers')
      .insert({
        user_id: userData.id,
        plan_id: planId,
        pterodactyl_server_id: server.id,
        pterodactyl_user_id: pterodactylUser.id,
        name: name,
        status: 'online',
        expiry_date: expiryDate.toISOString(),
      })
      .select()
      .single();

    if (serverError) {
      throw new Error(`Failed to save server to database: ${serverError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          server: userServer,
          pterodactyl: {
            panel_url: 'https://panel.snowhost.cloud',
            username: email,
          },
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in create-server function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

async function createPterodactylUser(email: string) {
  try {
    // First check if user already exists
    const existingUserResponse = await fetch(`${pterodactylApiUrl}/application/users?filter[email]=${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${pterodactylApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const existingUserData = await existingUserResponse.json();
    
    if (existingUserData.data && existingUserData.data.length > 0) {
      return existingUserData.data[0].attributes;
    }

    // Create new user if not exists
    const firstName = email.split('@')[0];
    const lastName = 'User';
    const username = email.split('@')[0].toLowerCase();
    const password = Math.random().toString(36).slice(-10);

    const response = await fetch(`${pterodactylApiUrl}/application/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pterodactylApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        username: username,
        first_name: firstName,
        last_name: lastName,
        password: password,
        root_admin: false,
        language: 'en',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Pterodactyl API error:', errorData);
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Send email with login details
    await sendLoginEmail(email, username, password);
    
    return data.attributes;
  } catch (error) {
    console.error('Error creating Pterodactyl user:', error);
    return null;
  }
}

async function createPterodactylServer(name: string, userId: number, ram: number, disk: number) {
  try {
    const response = await fetch(`${pterodactylApiUrl}/application/servers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pterodactylApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        user: userId,
        egg: 1, // Minecraft egg ID
        docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
        startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
        environment: {
          SERVER_JARFILE: 'server.jar',
          MINECRAFT_VERSION: 'latest',
          BUILD_TYPE: 'recommended',
          STARTUP: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
        },
        limits: {
          memory: ram,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: 100,
        },
        feature_limits: {
          databases: 1,
          backups: 1,
          allocations: 1,
        },
        allocation: {
          default: 1,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Pterodactyl API error:', errorData);
      throw new Error(`Failed to create server: ${response.statusText}`);
    }

    const data = await response.json();
    return data.attributes;
  } catch (error) {
    console.error('Error creating Pterodactyl server:', error);
    return null;
  }
}



async function sendLoginEmail(email, username, password) {
  const apiKey = Deno.env.get('RESEND_API_KEY') || 're_LPiqJewr_PQrRFKXLNJnNf2GKtCvK4irK'; // Here is the resend api key !!!!!!!!!!!!
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      from: 'no-reply@snowhost.cloud',
      to: [email],
      subject: 'Welcome to SnowHost - Your Account Details',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SnowHost</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <div style="display: inline-block; padding: 8px 16px; background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; margin-bottom: 20px;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">❄️ SnowHost</h1>
              </div>
              <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Welcome Aboard!</h2>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your premium hosting journey starts here</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                  <span style="color: white; font-size: 24px;">✓</span>
                </div>
                <h3 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 600;">Account Created Successfully</h3>
              </div>

              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
                Thank you for choosing SnowHost as your trusted hosting partner. Your account has been set up and is ready to use.
              </p>

              <!-- Account Details Card -->
              <div style="background-color: #f7fafc; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #667eea;">
                <h4 style="margin: 0 0 20px 0; color: #2d3748; font-size: 18px; font-weight: 600;">Your Account Details</h4>
                
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="display: inline-block; width: 20px; height: 20px; background-color: #667eea; border-radius: 4px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 12px;">👤</span>
                    </span>
                    <strong style="color: #2d3748; font-size: 14px;">Username</strong>
                  </div>
                  <div style="background-color: #ffffff; padding: 12px 15px; border-radius: 6px; border: 1px solid #e2e8f0; font-family: 'Courier New', monospace; font-size: 15px; color: #2d3748; font-weight: 600;">
                    ${username}
                  </div>
                </div>

                <div>
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="display: inline-block; width: 20px; height: 20px; background-color: #667eea; border-radius: 4px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 12px;">🔑</span>
                    </span>
                    <strong style="color: #2d3748; font-size: 14px;">Temporary Password</strong>
                  </div>
                  <div style="background-color: #ffffff; padding: 12px 15px; border-radius: 6px; border: 1px solid #e2e8f0; font-family: 'Courier New', monospace; font-size: 15px; color: #2d3748; font-weight: 600;">
                    ${password}
                  </div>
                </div>
              </div>

              <!-- Security Notice -->
              <div style="background-color: #fef5e7; border: 1px solid #f6ad55; border-radius: 6px; padding: 15px; margin: 25px 0;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="color: #ed8936; font-size: 18px; margin-right: 10px;">⚠️</span>
                  <div>
                    <strong style="color: #744210; font-size: 14px; display: block; margin-bottom: 5px;">Security Recommendation</strong>
                    <p style="color: #744210; font-size: 13px; margin: 0; line-height: 1.4;">
                      Please change your password immediately after your first login for enhanced security.
                    </p>
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://snowhost.cloud/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                  Access Your Dashboard
                </a>
              </div>

              <!-- Features -->
              <div style="margin: 30px 0;">
                <h4 style="color: #2d3748; font-size: 18px; font-weight: 600; margin-bottom: 20px; text-align: center;">What's Next?</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">🚀</div>
                    <div style="color: #4a5568; font-size: 14px; font-weight: 500;">Deploy Your Project</div>
                  </div>
                  <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                    <div style="color: #4a5568; font-size: 14px; font-weight: 500;">Monitor Performance</div>
                  </div>
                  <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">🔧</div>
                    <div style="color: #4a5568; font-size: 14px; font-weight: 500;">Configure Settings</div>
                  </div>
                  <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">💬</div>
                    <div style="color: #4a5568; font-size: 14px; font-weight: 500;">24/7 Support</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #4a5568; font-size: 14px; margin: 0 0 15px 0;">
                Need help? Our support team is here for you 24/7
              </p>
              <div style="margin-bottom: 20px;">
                <a href="mailto:support@snowhost.cloud" style="color: #667eea; text-decoration: none; font-weight: 500; margin: 0 15px;">📧 Support</a>
                <a href="https://snowhost.cloud/docs" style="color: #667eea; text-decoration: none; font-weight: 500; margin: 0 15px;">📚 Documentation</a>
                <a href="https://snowhost.cloud/status" style="color: #667eea; text-decoration: none; font-weight: 500; margin: 0 15px;">🔍 Status</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                © 2025 SnowHost. All rights reserved.<br>
                This email was sent to ${email}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }),
  });
  
  if (!res.ok) {
    const err = await res.text();
    console.error('Failed to send email:', err);
    throw new Error('Failed to send email');
  }
  
  console.log('Email sent successfully');
  console.log(`Sending login email to ${email} with username: ${username} and password: ${password}`);
  return true;
}
