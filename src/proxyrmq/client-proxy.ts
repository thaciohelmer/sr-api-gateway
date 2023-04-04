import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ClientProxySmartRanking {

  constructor(private readonly configService: ConfigService) { }

  private readonly RBMQ_USER = this.configService.get<string>('RBMQ_USER')
  private readonly RBMQ_PASSWORD = this.configService.get<string>('RBMQ_PASSWORD')
  private readonly RBMQ_URL = this.configService.get<string>('RBMQ_URL')

  getAdmBackend(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.RBMQ_USER}:${this.RBMQ_PASSWORD}@${this.RBMQ_URL}`],
        queue: 'admin-backend'
      }
    })
  }

  getChallenge(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.RBMQ_USER}:${this.RBMQ_PASSWORD}@${this.RBMQ_URL}`],
        queue: 'challenges'
      }
    })
  }

}