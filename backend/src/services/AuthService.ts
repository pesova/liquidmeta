import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import env from '../config/env';
import { Role, RoleEnum } from '../models/Role';

class AuthService {
  private readonly saltRounds = 10;
  private readonly jwtSecret = env.JWT_SECRET;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email, roleId: user.roleId },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  async register(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'password'> & { password: string }): Promise<{ user: IUser; token: string }> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      const hashedPassword = await this.hashPassword(userData.password);
      const role = await Role.findOne({ name: RoleEnum.USER });
      if (!role) {
        throw new Error('Role not found');
      }
      const user = await User.create({
        ...userData,
        roleId: role.id,
        password: hashedPassword
      });
  
      const token = this.generateToken(user);
  
      return { user, token };
      
    } catch (error) {
      throw error
    }
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string } | null> {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    const isValidPassword = await this.comparePasswords(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  verifyToken(token: string): { id: string; email: string; role: string } | null {
    try {
      return jwt.verify(token, this.jwtSecret) as { id: string; email: string; role: string };
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();
