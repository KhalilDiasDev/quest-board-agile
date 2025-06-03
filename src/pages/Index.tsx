
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Settings, BookOpen, Plus, Dice6, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { KanbanBoard } from '@/components/KanbanBoard';
import { CharacterSheet } from '@/components/CharacterSheet';
import { ActionLog } from '@/components/ActionLog';
import { TaskForm } from '@/components/TaskForm';
import { useGameStore } from '@/store/gameStore';

const Index = () => {
  const { character, tasks, diceType, setDiceType, resetAllTasks } = useGameStore();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalXpEarned = tasks
    .filter(task => task.status === 'done')
    .reduce((sum, task) => sum + task.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-orange-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <Sword size={32} className="text-yellow-300" />
              <div>
                <h1 className="text-2xl font-bold">Quest Master</h1>
                <p className="text-amber-200 text-sm">Sistema de Tarefas RPG</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              {/* Dice Type Selector */}
              <div className="flex items-center space-x-2 bg-amber-700 rounded-lg px-3 py-2">
                <Dice6 size={16} />
                <select
                  value={diceType}
                  onChange={(e) => setDiceType(Number(e.target.value))}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none"
                >
                  <option value={20} className="text-gray-800">D20</option>
                  <option value={12} className="text-gray-800">D12</option>
                  <option value={10} className="text-gray-800">D10</option>
                  <option value={8} className="text-gray-800">D8</option>
                  <option value={6} className="text-gray-800">D6</option>
                </select>
              </div>

              <Button
                onClick={resetAllTasks}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset Tasks
              </Button>

              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Nova Quest
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 border-2 p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-blue-700">Total de Quests</p>
                <p className="text-2xl font-bold text-blue-800">{totalTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-300 border-2 p-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏆</div>
              <div>
                <p className="text-sm text-green-700">Concluídas</p>
                <p className="text-2xl font-bold text-green-800">{completedTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 border-2 p-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⭐</div>
              <div>
                <p className="text-sm text-yellow-700">XP Total</p>
                <p className="text-2xl font-bold text-yellow-800">{totalXpEarned}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 border-2 p-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚡</div>
              <div>
                <p className="text-sm text-purple-700">Nível</p>
                <p className="text-2xl font-bold text-purple-800">{character.level}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Kanban Board */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <KanbanBoard onAddTask={() => setShowTaskForm(true)} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CharacterSheet />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ActionLog />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
      />
    </div>
  );
};

export default Index;
