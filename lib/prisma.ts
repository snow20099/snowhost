// prisma/schema.prisma
// This is your Prisma schema file for the user statistics system

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql" // or "postgresql", "sqlite", etc.
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String?   // For local auth
  provider      String?   // 'local', 'google', 'github', etc.
  providerId    String?   @map("provider_id")
  avatarUrl     String?   @map("avatar_url")
  emailVerified Boolean   @default(false) @map("email_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  // Relations
  servers       Server[]
  payments      Payment[]
  serverLogs    ServerLog[]
  subscriptions UserSubscription[]
  
  @@index([email])
  @@index([provider, providerId])
  @@map("users")
}

model Server {
  id          String      @id @default(cuid())
  userId      String      @map("user_id")
  name        String
  description String?
  status      ServerStatus @default(PENDING)
  serverType  String?     @map("server_type")
  plan        String?
  region      String?
  ipAddress   String?     @map("ip_address")
  monthlyCost Decimal     @default(0.00) @map("monthly_cost") @db.Decimal(10,2)
  specs       Json?       // Server specifications
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")
  deletedAt   DateTime?   @map("deleted_at")
  
  // Relations
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  payments    Payment[]
  serverLogs  ServerLog[]
  metrics     ServerMetric[]
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@index([userId, status])
  @@map("servers")
}

model Payment {
  id            String        @id @default(cuid())
  userId        String        @map("user_id")
  serverId      String?       @map("server_id")
  amount        Decimal       @db.Decimal(10,2)
  currency      String        @default("SAR")
  status        PaymentStatus @default(PENDING)
  paymentMethod String?       @map("payment_method")
  transactionId String?       @map("transaction_id")
  gateway       String?
  description   String?
  invoiceNumber String?       @map("invoice_number")
  paidAt        DateTime?     @map("paid_at")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")
  
  // Relations
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  server        Server?       @relation(fields: [serverId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@index([userId, status])
  @@index([userId, createdAt])
  @@map("payments")
}

model ServerLog {
  id          String   @id @default(cuid())
  serverId    String   @map("server_id")
  userId      String   @map("user_id")
  action      String
  description String?
  metadata    Json?
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  createdAt   DateTime @default(now()) @map("created_at")
  
  // Relations
  server      Server   @relation(fields: [serverId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([serverId])
  @@index([userId])
  @@index([createdAt])
  @@index([action])
  @@map("server_logs")
}

model ServerMetric {
  id           String   @id @default(cuid())
  serverId     String   @map("server_id")
  cpuUsage     Decimal? @map("cpu_usage") @db.Decimal(5,2)
  memoryUsage  Decimal? @map("memory_usage") @db.Decimal(5,2)
  diskUsage    Decimal? @map("disk_usage") @db.Decimal(5,2)
  networkIn    BigInt?  @map("network_in")
  networkOut   BigInt?  @map("network_out")
  uptime       BigInt?
  responseTime Decimal? @map("response_time") @db.Decimal(8,2)
  recordedAt   DateTime @default(now()) @map("recorded_at")
  
  // Relations
  server       Server   @relation(fields: [serverId], references: [id], onDelete: Cascade)
  
  @@index([serverId])
  @@index([recordedAt])
  @@index([serverId, recordedAt])
  @@map("server_metrics")
}

model UserSubscription {
  id                  String             @id @default(cuid())
  userId              String             @map("user_id")
  planName            String             @map("plan_name")
  planPrice           Decimal            @map("plan_price") @db.Decimal(10
