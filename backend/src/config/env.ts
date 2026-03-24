import dotenv from 'dotenv';
dotenv.config();

interface EnvironmentConfig {
  PORT: number;
  NODE_ENV: string;

  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  FRONTEND_URL: string;
  JWT_SALT: number
}

class EnvConfig {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      // Server configuration
      PORT: this.getNumber('PORT', 5000),
      NODE_ENV: this.getString('NODE_ENV', 'development'),
      
      // Database configuration
      MONGODB_URI: this.getString('MONGODB_URI', 'mongodb://localhost:27017/ai-marketlink'),
      
      // JWT configuration
      JWT_SECRET: this.getString('JWT_SECRET', 'fallback_secret_key_change_in_production'),
      JWT_EXPIRES_IN: this.getString('JWT_EXPIRES_IN', '24h'),
      
      FRONTEND_URL: this.getString('FRONTEND_URL', 'http://localhost:5173'),
      JWT_SALT: this.getNumber('JWT_SALT', 10)
    };
  }

  private getString(key: string, defaultValue: string): string {
    const value = process.env[key];
    return value || defaultValue;
  }

  private getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) return defaultValue;
    
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      console.warn(`Warning: Invalid number for ${key}, using default: ${defaultValue}`);
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

  // Validation method to check required environment variables
  public validate(): void {
    const required = ['MONGODB_URI', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn(`Warning: Missing required environment variables: ${missing.join(', ')}`);
      console.warn('Using fallback values. Set these in your .env file for production.');
    }
  }
}

const env = new EnvConfig();
env.validate();

export default env;