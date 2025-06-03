
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Heart, Star, Trash2, Edit, ArrowRight, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameStore, Task } from '@/store/gameStore';
import { DiceRoller } from './DiceRoller';

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { attemptMoveTask, character } = useGameStore();
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [targetStatus, setTargetStatus] = useState<Task['status']>('inprogress');

  const getNextStatus = (currentStatus: Task['status']): Task['status'] | null => {
    const flow: Record<Task['status'], Task['status'] | null> = {
      todo: 'inprogress',
      inprogress: 'done',
      done: 'finish',
      finish: null,
      failed: null
    };
    return flow[currentStatus];
  };

  const handleMoveAttempt = () => {
    const nextStatus = getNextStatus(task.status);
    if (nextStatus) {
      setTargetStatus(nextStatus);
      setShowDiceRoller(true);
    }
  };

  const handleDiceRoll = (result: number) => {
    attemptMoveTask(task.id, targetStatus);
  };

  const getCardStyle = () => {
    const baseStyle = "border-2 transition-all duration-300 hover:shadow-lg";
    
    switch (task.status) {
      case 'todo':
        return `${baseStyle} border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100`;
      case 'inprogress':
        return `${baseStyle} border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100`;
      case 'done':
        return `${baseStyle} border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100`;
      case 'finish':
        return `${baseStyle} border-green-400 bg-gradient-to-br from-green-50 to-green-100`;
      case 'failed':
        return `${baseStyle} border-red-400 bg-gradient-to-br from-red-50 to-red-100`;
      default:
        return baseStyle;
    }
  };

  const getMonsterIcon = () => {
    if (task.difficulty === 'hard') return '🐉'; // Dragon - Hard
    if (task.difficulty === 'medium') return '🧟'; // Zombie - Medium
    return '🐺'; // Wolf - Easy
  };

  const getDifficultyColor = () => {
    if (task.difficulty === 'hard') return 'text-red-600';
    if (task.difficulty === 'medium') return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCategoryIcon = () => {
    const icons = {
      technical: '💻',
      business: '📊', 
      design: '🎨',
      testing: '🧪',
      documentation: '📝'
    };
    return icons[task.category] || '📋';
  };

  const getCategoryColor = () => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      design: 'bg-purple-100 text-purple-800', 
      testing: 'bg-orange-100 text-orange-800',
      documentation: 'bg-gray-100 text-gray-800'
    };
    return colors[task.category] || 'bg-gray-100 text-gray-800';
  };

  const getAvatarAdvantage = () => {
    const { avatar } = character;
    if (!avatar) return null; // Add defensive check
    
    if (avatar.specialties?.includes(task.category)) {
      return { type: 'advantage', bonus: '+3', color: 'text-green-600' };
    }
    if (avatar.weaknesses?.includes(task.category)) {
      return { type: 'disadvantage', bonus: '-2', color: 'text-red-600' };
    }
    return null;
  };

  const nextStatus = getNextStatus(task.status);
  const advantage = getAvatarAdvantage();

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        className="w-full"
      >
        <Card className={getCardStyle()}>
          <div className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getMonsterIcon()}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-sm line-clamp-2">{task.name}</h3>
                  {task.description && (
                    <p className="text-xs text-gray-600 line-clamp-1">{task.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-1">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onEdit}
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                  >
                    <Edit size={12} />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
            </div>

            {/* Category and Difficulty */}
            <div className="flex items-center justify-between">
              <Badge className={`text-xs ${getCategoryColor()}`}>
                {getCategoryIcon()} {task.category}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getDifficultyColor()}`}>
                {task.difficulty}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Shield size={14} className={getDifficultyColor()} />
                <span className="font-semibold">CA {task.armorClass}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Heart size={14} className="text-red-500" />
                <span className="font-semibold">
                  {task.currentHp}/{task.hitPoints}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500" />
                <span className="font-semibold">{task.xpReward} XP</span>
              </div>
            </div>

            {/* HP Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(task.currentHp / task.hitPoints) * 100}%` }}
              />
            </div>

            {/* Chances Indicator */}
            {task.status !== 'finish' && task.status !== 'failed' && (
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xs font-medium">Chances:</span>
                {[...Array(task.maxChances)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < task.chances 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Avatar Advantage/Disadvantage */}
            {advantage && character.avatar && (
              <div className={`text-xs font-medium ${advantage.color} flex items-center space-x-1`}>
                <span>{character.avatar.icon}</span>
                <span>
                  {advantage.type === 'advantage' ? 'Vantagem' : 'Desvantagem'}: {advantage.bonus}
                </span>
              </div>
            )}

            {/* Status Badge and Action */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {task.status === 'todo' && 'Taverna'}
                {task.status === 'inprogress' && 'Missão'}
                {task.status === 'done' && 'Batalha'}
                {task.status === 'finish' && 'Vitória'}
                {task.status === 'failed' && 'Falha'}
              </Badge>

              {/* Action Button */}
              {nextStatus && task.chances > 0 && (
                <Button
                  size="sm"
                  onClick={handleMoveAttempt}
                  className="h-7 px-2 bg-amber-600 hover:bg-amber-700 text-white text-xs"
                >
                  <Sword size={12} className="mr-1" />
                  Atacar
                  <ArrowRight size={12} className="ml-1" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <DiceRoller
        isOpen={showDiceRoller}
        onClose={() => setShowDiceRoller(false)}
        onRoll={handleDiceRoll}
        targetAC={task.armorClass}
        taskName={task.name}
        taskCategory={task.category}
      />
    </>
  );
};
