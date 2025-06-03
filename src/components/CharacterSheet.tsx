
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Sparkles, TrendingUp, Star, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';

export const CharacterSheet: React.FC = () => {
  const { character, spellsUsed, availableAvatars, changeAvatar } = useGameStore();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const getAvatarColor = () => {
    const colors = {
      developer: 'from-blue-100 to-blue-200 border-blue-300',
      analyst: 'from-green-100 to-green-200 border-green-300',
      designer: 'from-purple-100 to-purple-200 border-purple-300',
      tester: 'from-orange-100 to-orange-200 border-orange-300',
      fullstack: 'from-gray-100 to-gray-200 border-gray-300'
    };
    return colors[character.avatar?.id as keyof typeof colors] || 'from-gray-100 to-gray-200 border-gray-300';
  };

  const xpProgress = (character.xp / character.xpToNext) * 100;

  // Add defensive checks for avatar
  if (!character.avatar) {
    return (
      <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 border-2">
        <div className="p-6">
          <p className="text-center text-gray-600">Carregando personagem...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br ${getAvatarColor()} border-2`}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{character.avatar.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{character.name}</h2>
              <Badge variant="outline" className="text-xs">
                {character.avatar.name} Nível {character.level}
              </Badge>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            className="h-8 w-8 p-0"
          >
            <Settings size={16} />
          </Button>
        </div>

        {/* Avatar Description */}
        <p className="text-sm text-gray-700">{character.avatar.description}</p>

        {/* Avatar Selector */}
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium">Escolher Avatar:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableAvatars.map((avatar) => (
                <Button
                  key={avatar.id}
                  size="sm"
                  variant={character.avatar.id === avatar.id ? "default" : "outline"}
                  onClick={() => {
                    changeAvatar(avatar.id);
                    setShowAvatarSelector(false);
                  }}
                  className="h-12 flex flex-col items-center justify-center text-xs"
                >
                  <span className="text-lg">{avatar.icon}</span>
                  <span>{avatar.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specialties and Weaknesses */}
        <div className="space-y-2">
          {character.avatar.specialties?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-700">Especialidades (+3):</p>
              <div className="flex flex-wrap gap-1">
                {character.avatar.specialties.map((specialty) => (
                  <Badge key={specialty} className="text-xs bg-green-100 text-green-800">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {character.avatar.weaknesses?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-700">Fraquezas (-2):</p>
              <div className="flex flex-wrap gap-1">
                {character.avatar.weaknesses.map((weakness) => (
                  <Badge key={weakness} className="text-xs bg-red-100 text-red-800">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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

        {/* Mage Spells Counter */}
        {character.avatar.id === 'mage' && (
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
