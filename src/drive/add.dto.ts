import { IsEmail, IsNotEmpty, IsJSON, IsOptional, IsNumber, IsEnum } from "class-validator";

export class AddAccountDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsJSON()
    credentials: string;

    @IsNotEmpty()
    @IsNumber()
    used: string;

    @IsNotEmpty()
    @IsNumber()
    total: string;

    @IsOptional()
    @IsEnum(["available"])
    status: string;
}
