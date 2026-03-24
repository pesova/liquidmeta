import dotenv from "dotenv";
dotenv.config();

interface EnvironmentConfig {
  PORT: number;
  NODE_ENV: string;

  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_SALT: number;

  FRONTEND_URL: string;

  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM_NAME: string;

  INTERSWITCH_CLIENT_ID: string;
  INTERSWITCH_CLIENT_SECRET: string;
  INTERSWITCH_PASSPORT_URL: string;
  INTERSWITCH_API_URL: string;

  INTERSWITCH_MARKETPLACE_CLIENT_ID: string;
  INTERSWITCH_MARKETPLACE_CLIENT_SECRET: string;
  INTERSWITCH_MARKETPLACE_PASSPORT_URL: string;
  INTERSWITCH_MARKETPLACE_API_URL: string;

  OPENAI_API_KEY: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

class EnvConfig {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      PORT: this.getNumber("PORT", 5000),
      NODE_ENV: this.getString("NODE_ENV", "development"),

      MONGODB_URI: this.getString(
        "MONGODB_URI",
        "mongodb://localhost:27017/ai-marketlink",
      ),

      JWT_SECRET: this.getString(
        "JWT_SECRET",
        "fallback_secret_key_change_in_production",
      ),
      JWT_EXPIRES_IN: this.getString("JWT_EXPIRES_IN", "24h"),
      JWT_SALT: this.getNumber("JWT_SALT", 10),

      FRONTEND_URL: this.getString("FRONTEND_URL", "http://localhost:5173"),

      MAIL_HOST: this.getString("MAIL_HOST", "smtp.gmail.com"),
      MAIL_PORT: this.getNumber("MAIL_PORT", 587),
      MAIL_USER: this.getString("MAIL_USER", ""),
      MAIL_PASS: this.getString("MAIL_PASS", ""),
      MAIL_FROM_NAME: this.getString("MAIL_FROM_NAME", "AI MarketLink"),

      INTERSWITCH_CLIENT_ID: this.getString("INTERSWITCH_CLIENT_ID", ""),
      INTERSWITCH_CLIENT_SECRET: this.getString(
        "INTERSWITCH_CLIENT_SECRET",
        "",
      ),
      INTERSWITCH_PASSPORT_URL: this.getString(
        "INTERSWITCH_PASSPORT_URL",
        "https://qa.interswitchng.com/passport",
      ),
      INTERSWITCH_API_URL: this.getString(
        "INTERSWITCH_API_URL",
        "https://api-marketplace-routing.k8.isw.la",
      ),

      INTERSWITCH_MARKETPLACE_CLIENT_ID: this.getString(
        "INTERSWITCH_MARKETPLACE_CLIENT_ID",
        "",
      ),
      INTERSWITCH_MARKETPLACE_CLIENT_SECRET: this.getString(
        "INTERSWITCH_MARKETPLACE_CLIENT_SECRET",
        "",
      ),
      INTERSWITCH_MARKETPLACE_PASSPORT_URL: this.getString(
        "INTERSWITCH_MARKETPLACE_PASSPORT_URL",
        "https://qa.interswitchng.com/passport",
      ),
      INTERSWITCH_MARKETPLACE_API_URL: this.getString(
        "INTERSWITCH_MARKETPLACE_API_URL",
        "https://api-marketplace-routing.k8.isw.la",
      ),
      CLOUDINARY_API_SECRET: this.getString("CLOUDINARY_API_SECRET", ""),
      CLOUDINARY_API_KEY: this.getString("CLOUDINARY_API_KEY", ""),
      CLOUDINARY_CLOUD_NAME: this.getString("CLOUDINARY_CLOUD_NAME", ""),
      OPENAI_API_KEY: this.getString("OPENAI_API_KEY", ""),
    };
  }

  private getString(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      console.warn(
        `Warning: Invalid number for ${key}, using default: ${defaultValue}`,
      );
      return defaultValue;
    }

    return parsed;
  }

  get PORT(): number {
    return this.config.PORT;
  }
  get NODE_ENV(): string {
    return this.config.NODE_ENV;
  }
  get MONGODB_URI(): string {
    return this.config.MONGODB_URI;
  }
  get JWT_SECRET(): string {
    return this.config.JWT_SECRET;
  }
  get JWT_SALT(): number {
    return this.config.JWT_SALT;
  }
  get JWT_EXPIRES_IN(): string {
    return this.config.JWT_EXPIRES_IN;
  }
  get FRONTEND_URL(): string {
    return this.config.FRONTEND_URL;
  }
  get MAIL_HOST(): string {
    return this.config.MAIL_HOST;
  }
  get MAIL_PORT(): number {
    return this.config.MAIL_PORT;
  }
  get MAIL_USER(): string {
    return this.config.MAIL_USER;
  }
  get MAIL_PASS(): string {
    return this.config.MAIL_PASS;
  }
  get MAIL_FROM_NAME(): string {
    return this.config.MAIL_FROM_NAME;
  }

  get INTERSWITCH_CLIENT_ID(): string {
    return this.config.INTERSWITCH_CLIENT_ID;
  }
  get INTERSWITCH_CLIENT_SECRET(): string {
    return this.config.INTERSWITCH_CLIENT_SECRET;
  }
  get INTERSWITCH_PASSPORT_URL(): string {
    return this.config.INTERSWITCH_PASSPORT_URL;
  }
  get INTERSWITCH_API_URL(): string {
    return this.config.INTERSWITCH_API_URL;
  }

  get INTERSWITCH_MARKETPLACE_CLIENT_ID(): string {
    return this.config.INTERSWITCH_MARKETPLACE_CLIENT_ID;
  }
  get INTERSWITCH_MARKETPLACE_CLIENT_SECRET(): string {
    return this.config.INTERSWITCH_MARKETPLACE_CLIENT_SECRET;
  }
  get INTERSWITCH_MARKETPLACE_PASSPORT_URL(): string {
    return this.config.INTERSWITCH_MARKETPLACE_PASSPORT_URL;
  }
  get INTERSWITCH_MARKETPLACE_API_URL(): string {
    return this.config.INTERSWITCH_MARKETPLACE_API_URL;
  }
  get OPENAI_API_KEY(): string {
    return this.config.OPENAI_API_KEY;
  }

  get CLOUDINARY_CLOUD_NAME(): string {
    return this.config.CLOUDINARY_CLOUD_NAME;
  }

  get CLOUDINARY_API_KEY(): string {
    return this.config.CLOUDINARY_API_KEY;
  }

  get CLOUDINARY_API_SECRET(): string {
    return this.config.CLOUDINARY_API_SECRET;
  }

  public validate(): void {
    const required = [
      "MONGODB_URI",
      "JWT_SECRET",
      "MAIL_USER",
      "MAIL_PASS",
      "INTERSWITCH_CLIENT_ID",
      "INTERSWITCH_CLIENT_SECRET",
      "INTERSWITCH_MARKETPLACE_CLIENT_ID",
      "INTERSWITCH_MARKETPLACE_CLIENT_SECRET",
    ];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Warning: Missing required environment variables: ${missing.join(", ")}`,
      );
    }
  }
}

const env = new EnvConfig();
env.validate();

export default env;
