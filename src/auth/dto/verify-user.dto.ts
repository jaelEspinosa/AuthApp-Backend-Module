import { IsString } from "class-validator";




export class VerifyUserDto {

    
 
    @IsString()
    tokenOneUse: string
 
    
    
 }