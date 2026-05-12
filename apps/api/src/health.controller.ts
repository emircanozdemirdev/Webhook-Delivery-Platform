import { Controller, Get } from "@nestjs/common";

type HealthResponse = {
  status: "ok";
  uptime: number;
};

@Controller("health")
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: "ok",
      uptime: process.uptime(),
    };
  }
}
