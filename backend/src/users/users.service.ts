import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    return this.userModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async validateLogin(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (!user || user.passwordHash !== password) {
      // In a real app, use bcrypt and never store plain passwords
      throw new UnauthorizedException('Invalid email or password');
    }

    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }

  async create(payload: {
    email: string;
    passwordHash: string;
    name: string;
    role?: UserRole;
  }): Promise<any> {
    const created = new this.userModel(payload);
    return created.save();
  }

  async update(
    id: string,
    payload: Partial<{
      email: string;
      passwordHash: string;
      name: string;
      role: UserRole;
      isActive: boolean;
    }>,
  ): Promise<any> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, payload, { returnDocument: 'after' })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('User not found');
    }
  }
}
// Commit 64 - 2024-05-29 14:30:00
// Commit 3 - 2024-05-01 20:15:00
// Commit 4 - 2024-05-01 02:11:00
// Commit 10 - 2024-05-03 05:35:00
// Commit 43 - 2024-05-16 20:00:00
// Commit 49 - 2024-05-17 19:05:00
