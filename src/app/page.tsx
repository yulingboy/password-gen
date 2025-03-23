'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generatePassword, calculatePasswordStrength, PASSWORD_TEMPLATES } from '@/lib/password';

export default function Home() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(32);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [batchPasswords, setBatchPasswords] = useState<string[]>([]);

  const handleGenerate = () => {
    try {
      if (batchCount > 1) {
        const passwords = Array.from({ length: batchCount }, () =>
          generatePassword({
            length,
            ...options,
          })
        );
        setBatchPasswords(passwords);
        setPassword(passwords[0]);
      } else {
        const newPassword = generatePassword({
          length,
          ...options,
        });
        setPassword(newPassword);
        setBatchPasswords([]);
      }
      setCopied(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async (text: string = password) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleTemplateChange = (templateId: keyof typeof PASSWORD_TEMPLATES) => {
    const template = PASSWORD_TEMPLATES[templateId];
    setLength(template.options.length);
    setOptions(template.options);
  };

  const handleBatchCopy = async () => {
    try {
      await navigator.clipboard.writeText(batchPasswords.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy batch:', error);
    }
  };

  const strength = calculatePasswordStrength(password);

  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-2">密码生成器</h1>
        <p className="text-gray-500 mb-6">生成安全可靠的密码</p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            选择模板
          </label>
          <Select onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="选择密码模板" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PASSWORD_TEMPLATES).map(([id, template]) => (
                <SelectItem key={id} value={id}>
                  {template.name} - {template.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative mb-6">
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <span className="flex-1 font-mono text-lg break-all">
              {password || '点击生成'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy()}
              className="shrink-0"
            >
              {copied ? '✓' : '📋'}
            </Button>
          </div>
        </div>

        {batchPasswords.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">批量生成的密码</h3>
              <Button variant="outline" size="sm" onClick={handleBatchCopy}>
                复制全部
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              {batchPasswords.map((pwd, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <code className="text-sm">{pwd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(pwd)}
                  >
                    复制
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>强度: {strength.label}</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i <= strength.score
                    ? [
                        'bg-red-500',
                        'bg-orange-500',
                        'bg-yellow-500',
                        'bg-green-500',
                        'bg-emerald-500',
                      ][i]
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2">
              长度: {length}
            </label>
            <Slider
              value={[length]}
              onValueChange={([value]) => setLength(value)}
              min={8}
              max={128}
              step={1}
              className="mb-6"
            />
          </div>

          <div>
            <label className="block mb-2">
              批量生成数量: {batchCount}
            </label>
            <Slider
              value={[batchCount]}
              onValueChange={([value]) => setBatchCount(value)}
              min={1}
              max={10}
              step={1}
              className="mb-6"
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">包含字符:</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'uppercase', label: '大写字母 (A-Z)' },
                { id: 'lowercase', label: '小写字母 (a-z)' },
                { id: 'numbers', label: '数字 (0-9)' },
                { id: 'symbols', label: '特殊字符 (!@#$%)' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={options[id as keyof typeof options]}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, [id]: checked === true }))
                    }
                  />
                  <label htmlFor={id} className="text-sm">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          className="w-full mt-6"
          size="lg"
        >
          🔄 生成密码
        </Button>
      </div>
    </main>
  );
}
