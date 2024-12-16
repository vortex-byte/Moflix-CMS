import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, Equals } from "class-validator";

enum UserStatus {
    ACTIVE = "active",
}

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsNumber()
    phone: number;

    @IsOptional()
    @IsString()
    country: string;

    @IsOptional()
    @Equals(UserStatus.ACTIVE)
    status: UserStatus;
}
