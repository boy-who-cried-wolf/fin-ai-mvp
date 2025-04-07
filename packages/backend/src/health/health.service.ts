import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosInstance, AxiosStatic } from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly aiServiceUrl: string;
  private readonly timeout: number;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.aiServiceUrl = this.configService.get<string>("aiService.url") || "http://127.0.0.1:8080";
    this.timeout = this.configService.get<number>("aiService.timeout") || 5000;
    
    // Create a custom Axios instance that forces IPv4
    this.axiosInstance = axios.create({
      baseURL: this.aiServiceUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      },
      // Force IPv4
      family: 4
    });

    this.logger.debug(`AI Service URL configured: ${this.aiServiceUrl}`);
  }

  async checkHealth() {
    this.logger.debug('Starting health check...');
    const aiServiceHealth = await this.checkAiServiceHealth();
    
    const healthStatus = {
      status: "ok",
      info: {
        backend: {
          status: "healthy"
        }
      },
      details: {
        aiService: aiServiceHealth
      }
    };

    this.logger.debug('Health check completed:', healthStatus);
    return healthStatus;
  }

  private async checkAiServiceHealth() {
    const healthEndpoint = '/health';
    this.logger.debug(`Checking AI service health at: ${this.aiServiceUrl}${healthEndpoint}`);

    try {
      this.logger.debug('Sending health check request to AI service...');
      const response = await this.axiosInstance.get(healthEndpoint);
      this.logger.debug('AI service health check response:', response.data);

      const healthStatus = {
        status: response.data.status,
        error: response.data.error,
        version: response.data.version,
        model_ready: response.data.model_ready
      };

      this.logger.debug('AI service health status:', healthStatus);
      return healthStatus;
    } catch (error) {
      this.logger.error('AI service health check failed:', {
        error: error.message,
        code: error.code,
        url: `${this.aiServiceUrl}${healthEndpoint}`,
        stack: error.stack
      });

      if (error.response) {
        this.logger.error('AI service response:', {
          status: error.response.status,
          data: error.response.data
        });
      }

      return {
        status: "unhealthy",
        error: error.message || "Failed to connect to AI service",
        version: "unknown",
        model_ready: false
      };
    }
  }
} 