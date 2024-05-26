import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import { GetUser } from './get-user.decorator';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('login')
  @Public()
  @UseGuards(AuthGuard('local'))
  login(@GetUser() user: User) {
    return this.authService.login(user);
  }

  @Patch('makeadmin/:id')
  makeAdmin(@Param('id') userId: string) {
    return this.authService.makeAdmin(userId);
  }
}
