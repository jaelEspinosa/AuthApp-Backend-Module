import { IsEmail, IsString } from "class-validator";




export class ResetPasswordDto {
    
    @IsString()
    tokenOneUse: string;

    @IsString()
    newPassword: string;
 
 
 
}