
import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Sparkles, TrendingUp, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/store/gameStore';

export const CharacterSheet: React.FC = () => {
  const { character, spellsUsed } = useGameStore();

  const classInfo = {
    warrior: {
      name: 'Guerreiro',
      icon: <Sword className="text-red-600" size={24} />,
      color: 'from-red-100 to-red-200',
      border: 'border-red-300',
      description: '+2 em todas as rolagens'
    },
    mage: {
      name: 'Mago',
      icon: <Sparkles className="text-purple-600" size={24} />,
      color: 'from-purple-100 to-purple-200',
      border: 'border-purple-300',
      description: '+1 nas rolagens + 3 magias por sprint'
    },
    rogue: {
      name: 'Ladino',
      icon: <Shield className="text-green-600" size={24} />,
      color: 'from-green-100 to-green-200',
      border: 'border-green-300',
      description: '+1 nas rolagens + habilidades especiais'
    }
  };

  const currentClass = classInfo[character.class];
  const xpProgress = (character.xp / character.xpToNext) * 100;

  return (
    <Card className={`bg-gradient-to-br ${currentClass.color} ${currentClass.border} border-2`}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3">
          {currentClass.icon}
          <div>
            <h2 className="text-xl font-bold">{character.name}</h2>
            <Badge variant="outline" className="text-xs">
              {currentClass.name} Nível {character.level}
            </Badge>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1">
              <Star className="text-yellow-500" size={16} />
              <span>Experiência</span>
            </span>
            <span className="font-semibold">
              {character.xp} / {character.xpToNext} XP
            </span>
          </div>
          
          <Progress value={xpProgress} className="h-3" />
          
          {xpProgress >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <Badge className="bg-yellow-500 text-white">
                <TrendingUp size={12} className="mr-1" />
                Pronto para subir de nível!
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Class Description */}
        <div className="text-sm text-gray-700">
          <p className="font-medium">Habilidade de Classe:</p>
          <p>{currentClass.description}</p>
        </div>

        {/* Mage Spells Counter */}
        {character.class === 'mage' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-1">
                <Sparkles className="text-purple-500" size={16} />
                <span>Magias Usadas</span>
              </span>
              <span className="font-semibold">{spellsUsed} / 3</span>
            </div>
            
            <div className="flex space-x-1">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    index < spellsUsed
                      ? 'bg-purple-500 border-purple-600 text-white'
                      : 'bg-white border-purple-300 text-purple-300'
                  }`}
                >
                  ✦
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Abilities */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Habilidades Desbloqueadas:</p>
          <div className="flex flex-wrap gap-1">
            {character.abilities.map((ability, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs"
              >
                {ability}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
