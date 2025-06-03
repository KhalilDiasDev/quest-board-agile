
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  name: string;
  description: string;
  armorClass: number;
  hitPoints: number;
  currentHp: number;
  status: 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
  xpReward: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Character {
  name: string;
  class: 'warrior' | 'mage' | 'rogue';
  level: number;
  xp: number;
  xpToNext: number;
  abilities: string[];
}

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: string[];
  isActive: boolean;
}

export interface ActionLog {
  id: string;
  type: 'roll' | 'move' | 'levelup' | 'sprint';
  message: string;
  timestamp: Date;
  diceRoll?: number;
  success?: boolean;
}

interface GameState {
  tasks: Task[];
  character: Character;
  sprints: Sprint[];
  currentSprint: Sprint | null;
  actionLog: ActionLog[];
  diceType: number;
  spellsUsed: number;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  
  rollDice: () => number;
  attemptMoveTask: (taskId: string, newStatus: Task['status']) => boolean;
  
  gainXp: (amount: number) => void;
  levelUp: () => void;
  
  createSprint: (sprint: Omit<Sprint, 'id'>) => void;
  setActiveSprint: (sprintId: string) => void;
  
  addLog: (log: Omit<ActionLog, 'id' | 'timestamp'>) => void;
  
  setDiceType: (type: number) => void;
  useSpell: () => boolean;
  resetSpellsForSprint: () => void;
}

const characterClasses = {
  warrior: {
    name: 'Guerreiro',
    bonus: 2,
    abilities: ['Força Bruta', 'Resistência', 'Liderança']
  },
  mage: {
    name: 'Mago',
    bonus: 1,
    abilities: ['Reroll Spell', 'Sabedoria Arcana', 'Concentração']
  },
  rogue: {
    name: 'Ladino',
    bonus: 1,
    abilities: ['Sorte', 'Agilidade', 'Precisão']
  }
};

// Tarefas pré-definidas para o repositório de saberes
const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Levantamento de Requisitos',
    description: 'Definir funcionalidades e escopo do repositório de saberes',
    armorClass: 8,
    hitPoints: 2,
    currentHp: 2,
    status: 'backlog',
    xpReward: 80,
    createdAt: new Date()
  },
  {
    id: 'task-2',
    name: 'Modelagem do Banco de Dados',
    description: 'Criar diagrama ER e estrutura das tabelas para armazenar conhecimentos',
    armorClass: 12,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 120,
    createdAt: new Date()
  },
  {
    id: 'task-3',
    name: 'Implementar Sistema de Autenticação',
    description: 'Desenvolver login/logout e controle de acesso de usuários',
    armorClass: 15,
    hitPoints: 4,
    currentHp: 4,
    status: 'backlog',
    xpReward: 150,
    createdAt: new Date()
  },
  {
    id: 'task-4',
    name: 'Criar Interface de Upload',
    description: 'Tela para upload de documentos, vídeos e materiais de conhecimento',
    armorClass: 10,
    hitPoints: 2,
    currentHp: 2,
    status: 'backlog',
    xpReward: 100,
    createdAt: new Date()
  },
  {
    id: 'task-5',
    name: 'Sistema de Busca e Filtros',
    description: 'Implementar busca textual e filtros por categoria, autor, data',
    armorClass: 16,
    hitPoints: 5,
    currentHp: 5,
    status: 'backlog',
    xpReward: 180,
    createdAt: new Date()
  },
  {
    id: 'task-6',
    name: 'Dashboard de Administração',
    description: 'Painel para gestão de conteúdos, usuários e estatísticas',
    armorClass: 13,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 130,
    createdAt: new Date()
  },
  {
    id: 'task-7',
    name: 'Sistema de Comentários',
    description: 'Permitir comentários e discussões nos materiais compartilhados',
    armorClass: 9,
    hitPoints: 2,
    currentHp: 2,
    status: 'backlog',
    xpReward: 90,
    createdAt: new Date()
  },
  {
    id: 'task-8',
    name: 'Implementar Tags e Categorização',
    description: 'Sistema de tags para organizar e categorizar o conhecimento',
    armorClass: 11,
    hitPoints: 2,
    currentHp: 2,
    status: 'backlog',
    xpReward: 110,
    createdAt: new Date()
  },
  {
    id: 'task-9',
    name: 'API RESTful',
    description: 'Desenvolver endpoints para integração com outras aplicações',
    armorClass: 14,
    hitPoints: 4,
    currentHp: 4,
    status: 'backlog',
    xpReward: 160,
    createdAt: new Date()
  },
  {
    id: 'task-10',
    name: 'Testes Automatizados',
    description: 'Criar suite de testes unitários e de integração',
    armorClass: 17,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 170,
    createdAt: new Date()
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      character: {
        name: 'Aventureiro',
        class: 'warrior',
        level: 1,
        xp: 0,
        xpToNext: 100,
        abilities: [characterClasses.warrior.abilities[0]]
      },
      sprints: [],
      currentSprint: null,
      actionLog: [],
      diceType: 20,
      spellsUsed: 0,

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          currentHp: taskData.hitPoints
        };
        
        set((state) => ({
          tasks: [...state.tasks, task]
        }));
        
        get().addLog({
          type: 'move',
          message: `Nova quest criada: "${task.name}" (CA: ${task.armorClass}, HP: ${task.hitPoints})`
        });
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },

      moveTask: (id, newStatus) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const updates: Partial<Task> = { status: newStatus };
        
        if (newStatus === 'done' && task.status !== 'done') {
          updates.completedAt = new Date();
          get().gainXp(task.xpReward);
          
          get().addLog({
            type: 'move',
            message: `Quest concluída: "${task.name}" (+${task.xpReward} XP)`
          });
        } else {
          const statusNames = {
            backlog: 'Backlog',
            todo: 'A Fazer',
            inprogress: 'Em Progresso',
            review: 'Revisão',
            done: 'Concluído'
          };
          
          get().addLog({
            type: 'move',
            message: `"${task.name}" movida para ${statusNames[newStatus]}`
          });
        }

        get().updateTask(id, updates);
      },

      rollDice: () => {
        const { diceType, character } = get();
        const baseRoll = Math.floor(Math.random() * diceType) + 1;
        const classBonus = characterClasses[character.class].bonus;
        return baseRoll + classBonus;
      },

      attemptMoveTask: (taskId, newStatus) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return false;

        const roll = get().rollDice();
        const success = roll >= task.armorClass;
        
        get().addLog({
          type: 'roll',
          message: success 
            ? `Rolou ${roll}, superou CA ${task.armorClass}! Quest "${task.name}" pode ser movida.`
            : `Rolou ${roll}, falhou contra CA ${task.armorClass}. Quest "${task.name}" resiste!`,
          diceRoll: roll,
          success
        });

        if (success) {
          if (newStatus === 'done') {
            // Se a tarefa está sendo concluída, reduzir HP
            const newHp = task.currentHp - 1;
            if (newHp <= 0) {
              get().moveTask(taskId, newStatus);
            } else {
              get().updateTask(taskId, { currentHp: newHp });
              get().addLog({
                type: 'move',
                message: `"${task.name}" recebeu dano! HP restante: ${newHp}/${task.hitPoints}`
              });
            }
          } else {
            get().moveTask(taskId, newStatus);
          }
        }

        return success;
      },

      gainXp: (amount) => {
        set((state) => {
          const newXp = state.character.xp + amount;
          let newLevel = state.character.level;
          let newXpToNext = state.character.xpToNext;
          
          if (newXp >= state.character.xpToNext) {
            newLevel++;
            newXpToNext = newLevel * 100;
            
            // Level up effects
            setTimeout(() => get().levelUp(), 500);
          }
          
          return {
            character: {
              ...state.character,
              xp: newXp,
              level: newLevel,
              xpToNext: newXpToNext
            }
          };
        });
      },

      levelUp: () => {
        const { character } = get();
        const classData = characterClasses[character.class];
        
        get().addLog({
          type: 'levelup',
          message: `Subiu para o nível ${character.level}! Novas habilidades desbloqueadas!`
        });
      },

      createSprint: (sprintData) => {
        const sprint: Sprint = {
          ...sprintData,
          id: crypto.randomUUID()
        };
        
        set((state) => ({
          sprints: [...state.sprints, sprint]
        }));
      },

      setActiveSprint: (sprintId) => {
        const sprint = get().sprints.find(s => s.id === sprintId);
        if (sprint) {
          set({ currentSprint: sprint });
          get().resetSpellsForSprint();
        }
      },

      addLog: (logData) => {
        const log: ActionLog = {
          ...logData,
          id: crypto.randomUUID(),
          timestamp: new Date()
        };
        
        set((state) => ({
          actionLog: [log, ...state.actionLog].slice(0, 50) // Keep last 50 logs
        }));
      },

      setDiceType: (type) => {
        set({ diceType: type });
      },

      useSpell: () => {
        const { character, spellsUsed } = get();
        if (character.class === 'mage' && spellsUsed < 3) {
          set((state) => ({
            spellsUsed: state.spellsUsed + 1
          }));
          return true;
        }
        return false;
      },

      resetSpellsForSprint: () => {
        set({ spellsUsed: 0 });
      }
    }),
    {
      name: 'rpg-task-manager'
    }
  )
);
