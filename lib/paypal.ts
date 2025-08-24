import paypalSdk from "@paypal/checkout-server-sdk";

const clientId = "AWBa4pYfV3BWFgACZePWz1xJ5zD5nk0SiIzi1zMp74Uy66OBin9m0-EfA0VUaC1GLXIfY3FAYINto4QG";
const clientSecret = "EPaytUlGv8XwqVAOf5rv7d25vrNnkq_Hs5D_37ubikJDA2K6TrGK3qAfyMsk2Y_2CXIsPAXCnRDLQUFT";

// إعداد البيئة (sandbox أو live)
const environment = new paypalSdk.core.SandboxEnvironment(clientId, clientSecret);
// للبيئة المباشرة: const environment = new paypalSdk.core.LiveEnvironment(clientId, clientSecret);

export const client = () => new paypalSdk.core.PayPalHttpClient(environment);
export const paypal = paypalSdk;
