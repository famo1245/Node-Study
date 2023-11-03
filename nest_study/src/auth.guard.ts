import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userInfo = this.validateRequest(request);
    request.user = {
      name: userInfo.name,
      email: userInfo.email,
    };
    return true;
  }

  private validateRequest(request: Request) {
    const jwtString = request.headers.authorization.split("Bearer ")[1];
    return this.authService.verify(jwtString);
  }
}
