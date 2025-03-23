// 定义字符集
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
} as const;

// 预设模板
export const PASSWORD_TEMPLATES = {
  standard: {
    name: '标准',
    description: '包含大小写字母、数字和符号的强密码',
    options: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    }
  },
  pin: {
    name: 'PIN码',
    description: '纯数字密码',
    options: {
      length: 8,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
    }
  },
  memorable: {
    name: '易记忆',
    description: '仅包含字母和数字的密码',
    options: {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    }
  },
  strong: {
    name: '超强',
    description: '长度为24的超强密码',
    options: {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    }
  }
} as const;

// 密码选项接口
export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

// 生成密码
export function generatePassword(options: PasswordOptions): string {
  // 验证选项
  if (options.length < 8 || options.length > 128) {
    throw new Error('密码长度必须在 8-128 之间');
  }
  
  if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
    throw new Error('至少需要选择一种字符类型');
  }

  // 构建字符集
  let chars = '';
  if (options.uppercase) chars += CHAR_SETS.uppercase;
  if (options.lowercase) chars += CHAR_SETS.lowercase;
  if (options.numbers) chars += CHAR_SETS.numbers;
  if (options.symbols) chars += CHAR_SETS.symbols;

  // 使用 Web Crypto API 生成密码
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}

// 计算密码强度
export function calculatePasswordStrength(password: string): {
  score: number;  // 0-4
  label: string;
} {
  if (!password) return { score: 0, label: '无' };
  
  let score = 0;
  
  // 长度检查
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 0.5;
  
  // 字符类型检查
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // 复杂性检查
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 0.5;

  // 映射分数到标签
  let label = '弱';
  if (score >= 4) label = '非常强';
  else if (score >= 3) label = '强';
  else if (score >= 2) label = '中等';
  else if (score >= 1) label = '弱';
  
  return {
    score: Math.min(4, Math.floor(score)),
    label
  };
} 