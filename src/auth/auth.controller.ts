import { Controller, Get, Post, Body, UseGuards, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from './guards/auth.guard';

import { CreateUserDto, ForgotPasswordDto, LoginDto, RegisterUserDto, ResetPasswordDto, VerifyUserDto,  } from './dto';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login( loginDto );
  }

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register( registerUserDto );
  }

  @Put('/verify')
  verify(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verify( verifyUserDto );
  }

  @Put('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    return this.authService.forgotPassword( forgotPasswordDto)
  }

  @Put('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Get()
  @UseGuards( AuthGuard )
  findAll( @Request() req: Request ) {
    //const user = req['user']
    //return user;
    return this.authService.findAll();
  }


  @Get('/check-token')
  @UseGuards( AuthGuard )
  checkToken( @Request() req: Request ): LoginResponse {
   const user = req['user'] as User;
    return{
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }

}
