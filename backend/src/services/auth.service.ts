import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

// Define os tipos de entrada para registro e login com o role de usuário dinâmico
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

    // Hash da senha com bcrypt antes de salvar no banco
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    // Gera um token JWT com o ID para o usuário
    const token = signToken({ userId: user.id });

    // Retorna o token e os dados do usuário (sem a senha)
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(data: LoginInput) {
    // Valida se não há um usuário com o email fornecido
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
