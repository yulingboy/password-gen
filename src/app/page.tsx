'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { generatePassword, calculatePasswordStrength } from '@/lib/password';

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

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword({
        length,
        ...options,
      });
      setPassword(newPassword);
      setCopied(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const strength = calculatePasswordStrength(password);

  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-gray-500 mb-6">Create strong and secure passwords</p>

        <div className="relative mb-6">
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <span className="flex-1 font-mono text-lg">{password || 'Click Generate'}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? '✓' : '📋'}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Strength: {strength.label}</span>
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

        <div className="mb-6">
          <label className="block mb-2">
            Length: {length}
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

        <div className="space-y-4 mb-6">
          <h3 className="font-medium mb-2">Include:</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'uppercase', label: 'Uppercase (A-Z)' },
              { id: 'lowercase', label: 'Lowercase (a-z)' },
              { id: 'numbers', label: 'Numbers (0-9)' },
              { id: 'symbols', label: 'Symbols (!@#$%)' },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={options[id as keyof typeof options]}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, [id]: checked }))
                  }
                />
                <label htmlFor={id} className="text-sm">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          className="w-full"
          size="lg"
        >
          🔄 Generate Password
        </Button>
      </div>
    </main>
  );
}
