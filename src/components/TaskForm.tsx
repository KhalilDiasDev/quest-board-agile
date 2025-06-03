
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useGameStore } from '@/store/gameStore';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose }) => {
  const { addTask } = useGameStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    armorClass: [10],
    hitPoints: [1],
    xpReward: [50]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    addTask({
      name: formData.name,
      description: formData.description,
      armorClass: formData.armorClass[0],
      hitPoints: formData.hitPoints[0],
      currentHp: formData.hitPoints[0],
      xpReward: formData.xpReward[0],
      status: 'backlog'
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      armorClass: [10],
      hitPoints: [1],
      xpReward: [50]
    });
    
    onClose();
  };

  const getDifficultyLabel = (ac: number) => {
    if (ac >= 18) return { label: 'Lendário', color: 'text-red-600', icon: '🐉' };
    if (ac >= 15) return { label: 'Épico', color: 'text-orange-600', icon: '👹' };
    if (ac >= 12) return { label: 'Difícil', color: 'text-yellow-600', icon: '🧟' };
    if (ac >= 8) return { label: 'Médio', color: 'text-green-600', icon: '🐺' };
    return { label: 'Fácil', color: 'text-gray-600', icon: '🐀' };
  };

  if (!isOpen) return null;

  const difficulty = getDifficultyLabel(formData.armorClass[0]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300 border-2 p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-800">
            📜 Nova Quest
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-amber-700 hover:bg-amber-200"
          >
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-amber-800 font-semibold">
              Nome da Quest *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Implementar autenticação"
              className="border-amber-300 focus:ring-amber-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-amber-800 font-semibold">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva os detalhes da quest..."
              rows={3}
              className="border-amber-300 focus:ring-amber-500"
            />
          </div>

          {/* Armor Class */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-amber-800 font-semibold">
                Classe de Armadura (CA)
              </Label>
              <div className={`flex items-center space-x-2 ${difficulty.color} font-bold`}>
                <span>{difficulty.icon}</span>
                <span>{formData.armorClass[0]}</span>
                <span className="text-sm">({difficulty.label})</span>
              </div>
            </div>
            <Slider
              value={formData.armorClass}
              onValueChange={(value) => setFormData({ ...formData, armorClass: value })}
              max={20}
              min={5}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-amber-600">
              Quanto maior a CA, mais difícil será mover a quest (5-20)
            </p>
          </div>

          {/* Hit Points */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-amber-800 font-semibold">
                Pontos de Vida (HP)
              </Label>
              <div className="flex items-center space-x-2 text-red-600 font-bold">
                <span>❤️</span>
                <span>{formData.hitPoints[0]}</span>
              </div>
            </div>
            <Slider
              value={formData.hitPoints}
              onValueChange={(value) => setFormData({ ...formData, hitPoints: value })}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-amber-600">
              Quantos ataques são necessários para concluir (1-5)
            </p>
          </div>

          {/* XP Reward */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-amber-800 font-semibold">
                Recompensa XP
              </Label>
              <div className="flex items-center space-x-2 text-yellow-600 font-bold">
                <span>⭐</span>
                <span>{formData.xpReward[0]}</span>
              </div>
            </div>
            <Slider
              value={formData.xpReward}
              onValueChange={(value) => setFormData({ ...formData, xpReward: value })}
              max={200}
              min={10}
              step={10}
              className="w-full"
            />
            <p className="text-xs text-amber-600">
              Experiência ganha ao concluir a quest (10-200)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              🗡️ Criar Quest
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
