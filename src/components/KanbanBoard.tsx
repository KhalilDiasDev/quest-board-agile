
import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore, Task } from '@/store/gameStore';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  icon: string;
  color: string;
  onAddTask?: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  icon,
  color,
  onAddTask
}) => {
  return (
    <Card className={`${color} border-2 h-fit min-h-[400px]`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{icon}</span>
            <h3 className="font-bold text-lg">{title}</h3>
            <span className="bg-white/50 text-xs px-2 py-1 rounded-full font-semibold">
              {tasks.length}
            </span>
          </div>
          
          {status === 'backlog' && onAddTask && (
            <Button
              size="sm"
              onClick={onAddTask}
              className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus size={16} />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {/* TODO: Implement edit */}}
              onDelete={() => {/* TODO: Implement delete */}}
            />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma quest aqui</p>
              {status === 'backlog' && (
                <p className="text-xs mt-1">Clique no + para criar uma nova quest</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

interface KanbanBoardProps {
  onAddTask: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onAddTask }) => {
  const { tasks } = useGameStore();

  const columns = [
    {
      title: 'Taverna',
      status: 'todo' as const,
      icon: '🍺',
      color: 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300'
    },
    {
      title: 'Missão',
      status: 'inprogress' as const,
      icon: '⚔️',
      color: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
    },
    {
      title: 'Batalha',
      status: 'done' as const,
      icon: '⚡',
      color: 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300'
    },
    {
      title: 'Vitória',
      status: 'finish' as const,
      icon: '🏆',
      color: 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
    },
    {
      title: 'Falha',
      status: 'failed' as const,
      icon: '💀',
      color: 'bg-gradient-to-br from-red-100 to-red-200 border-red-300'
    }
  ];

  const getTasksForStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-6 min-w-max p-6">
        {columns.map((column) => (
          <motion.div
            key={column.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: columns.indexOf(column) * 0.1 }}
            className="min-w-[280px]"
          >
            <KanbanColumn
              title={column.title}
              status={column.status}
              tasks={getTasksForStatus(column.status)}
              icon={column.icon}
              color={column.color}
              onAddTask={column.status === 'todo' ? onAddTask : undefined}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
