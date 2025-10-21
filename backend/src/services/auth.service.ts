import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'PRODUTOR' | 'PRESTADOR'; 
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterInput) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new Error('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    const token = signToken({ userId: user.id });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Usuário ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Usuário ou senha inválidos');
    }

    const token = signToken({ userId: user.id });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
