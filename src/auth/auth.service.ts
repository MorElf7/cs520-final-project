import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/schemas/user.schema';
import {
  Application,
  ApplicationDocument,
} from 'src/schemas/application.schema';
import { CreateUserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // private usersService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if the user already exists
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password before saving (using bcrypt)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword, // Save the hashed password, not the plain one
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      const user = await newUser.save();
      const payload = {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      email: user.email,
      id: user._id,
      name: user.firstName + ' ' + user.lastName,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findOneUser(@Param('email') email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOneUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find({}, { password: 0 }).exec();
  }
}
