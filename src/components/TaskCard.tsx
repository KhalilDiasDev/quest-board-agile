
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Heart, Star, Trash2, Edit, ArrowRight } from 'lucide-react';
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
  const { attemptMoveTask } = useGameStore();
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [targetStatus, setTargetStatus] = useState<Task['status']>('todo');

  const getNextStatus = (currentStatus: Task['status']): Task['status'] | null => {
    const flow: Record<Task['status'], Task['status'] | null> = {
      backlog: 'todo',
      todo: 'inprogress',
      inprogress: 'review',
      review: 'done',
      done: null
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
      case 'backlog':
        return `${baseStyle} border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100`;
      case 'todo':
        return `${baseStyle} border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100`;
      case 'inprogress':
        return `${baseStyle} border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100`;
      case 'review':
        return `${baseStyle} border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100`;
      case 'done':
        return `${baseStyle} border-green-400 bg-gradient-to-br from-green-50 to-green-100`;
      default:
        return baseStyle;
    }
  };

  const getMonsterIcon = () => {
    if (task.armorClass >= 18) return '🐉'; // Dragon
    if (task.armorClass >= 15) return '👹'; // Demon
    if (task.armorClass >= 12) return '🧟'; // Zombie
    if (task.armorClass >= 8) return '🐺'; // Wolf
    return '🐀'; // Rat
  };

  const getDifficultyColor = () => {
    if (task.armorClass >= 18) return 'text-red-600';
    if (task.armorClass >= 15) return 'text-orange-600';
    if (task.armorClass >= 12) return 'text-yellow-600';
    if (task.armorClass >= 8) return 'text-green-600';
    return 'text-gray-600';
  };

  const nextStatus = getNextStatus(task.status);

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
                <div>
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

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {task.status === 'backlog' && 'Backlog'}
                {task.status === 'todo' && 'A Fazer'}
                {task.status === 'inprogress' && 'Em Progresso'}
                {task.status === 'review' && 'Revisão'}
                {task.status === 'done' && 'Concluído'}
              </Badge>

              {/* Action Button */}
              {nextStatus && (
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
      />
    </>
  );
};
