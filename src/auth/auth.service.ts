import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs'

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';

import { LoginResponse } from './interfaces/login-response';
import { CreateUserDto, LoginDto, RegisterUserDto, ResetPasswordDto, UpdateAuthDto } from './dto';
import { EmailService } from './services/email.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { generateTokenOneUse } from './helpers/generateToken';



@Injectable()
export class AuthService {

   constructor(
    @InjectModel(User.name ) 
    private userModel: Model<User>,
    private emailService: EmailService,
    private jwtService: JwtService,
   ){}

async create(createUserDto: CreateUserDto): Promise<User> {

      try {
        
        // 1- encriptar la contraseña
        const{password, ...userData} = createUserDto;
        const newUser = new this.userModel({
          password: bcryptjs.hashSync( password, 10),
          ...userData
        })
        // 2- guardar el usuario
        await newUser.save()

        
        
        const{ password:_, ...user} = newUser.toJSON();

        const text = `Hola ${user.name}, tu cuenta a sido creada solo queda un paso, confirma tu cuenta a través del siguiente enlace`
        
        this.emailService.sendEmail(user.email, 'AuthApp', user)
        
        return user;     
      
      } catch (error) {

      // 4- Manejar excepciones
        if ( error.code === 11000){
          throw new BadRequestException(`${ createUserDto.email }, already exists!`)
        }
        throw new InternalServerErrorException('Some terrible happen!!!')
      }
      }


async verify ( verifyUserDto: VerifyUserDto ) {

      const{ tokenOneUse } = verifyUserDto;

      // buscamos al user por el token de un solo uso
      const user = await this.userModel.findOne({ tokenOneUse })
      
      // si lo encontramos lo activamos
      if (user){
          user.tokenOneUse = null;
          user.isActive = true;
          // y lo guardamos  
          user.save()
            return {
              name :user.name,
              msg : 'Activado con éxito'
            }
        }else{
      // No se encontró el usuario
        throw new BadRequestException('Enlace de validacion inválido')
      }

}

async forgotPassword ( forgotPasswordDto: ForgotPasswordDto){

  //Buscamos al user por email
  const { email } = forgotPasswordDto
  console.log(email)

  const user = await this.userModel.findOne({email})

  // comprobamos que el usuario existe
  if (!user){
     throw new BadRequestException ('Email no encontrado')
  }
  user.tokenOneUse = generateTokenOneUse()

  user.save()

  // mandamos el email para resetear pass

  this.emailService.sendEmailForResetPassword(user.email, 'Auth-App', user)

  return {
    msg:'email enviado con éxito'
  }
}

async resetPassword ( resetPasswordDto: ResetPasswordDto ){

  const{ tokenOneUse, newPassword } = resetPasswordDto

  try {
       // buscamos el user por el token de un solo uso
        const user = await this.userModel.findOne({tokenOneUse})
      
        // si no se encuentra se envia error
        if(!user){
              throw new BadRequestException('Enlace de validación no válido')
        }
      
        //modificamos el password y guardamos en db
        user.password = bcryptjs.hashSync( newPassword, 10);
        user.tokenOneUse = null;
        user.save()
        return {
          msg:'Password reseteado con éxito'
        }
    
  } catch (error) {
       console.log(error)
       throw new BadRequestException(error)
  }


}




async register(registerUserDto: RegisterUserDto){
  try {

    const user = await this.create( registerUserDto )

    return {
      user,
      token: this.getJwtToken( {id: user._id} )
    }
    
  } catch (error) {
    
      throw new BadRequestException(`${ registerUserDto.email }, already exists!`)
   
  }

  
}        

async login( loginDto: LoginDto): Promise<LoginResponse>{
      const {email, password} = loginDto
      
      const user = await this.userModel.findOne({ email })

      if (!user ){
        throw new UnauthorizedException(' Not valid credentials - email ')
      }

      if (!user.isActive){
        throw new UnauthorizedException('Unverified account, please check your email')
      }
      
      if (!bcryptjs.compareSync( password, user.password)){
        throw new UnauthorizedException(' Not valid credentials - password ')

      }

    const { password:_, ...rest} = user.toJSON();
    
      return {
      user: rest,
      token: this.getJwtToken({id: user.id})
    }

}


  async findAll():Promise<User[]> {
    return await this.userModel.find()
  }
  
  async findUserById(id: string) {
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    return rest;

  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload){
    const token = this.jwtService.sign( payload );
    return token;
  }
}
