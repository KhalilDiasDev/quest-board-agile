
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'business' | 'design' | 'testing' | 'documentation';
  difficulty: 'easy' | 'medium' | 'hard';
  armorClass: number;
  hitPoints: number;
  currentHp: number;
  status: 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
  xpReward: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Avatar {
  id: string;
  name: string;
  description: string;
  icon: string;
  specialties: Task['category'][];
  weaknesses: Task['category'][];
  baseBonus: number;
}

export interface Character {
  name: string;
  avatar: Avatar;
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
  availableAvatars: Avatar[];
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
  
  rollDice: (taskCategory: Task['category']) => number;
  attemptMoveTask: (taskId: string, newStatus: Task['status']) => boolean;
  
  gainXp: (amount: number) => void;
  levelUp: () => void;
  
  createSprint: (sprint: Omit<Sprint, 'id'>) => void;
  setActiveSprint: (sprintId: string) => void;
  
  addLog: (log: Omit<ActionLog, 'id' | 'timestamp'>) => void;
  
  setDiceType: (type: number) => void;
  changeAvatar: (avatarId: string) => void;
  useSpell: () => boolean;
  resetSpellsForSprint: () => void;
}

// Avatares disponíveis
const avatars: Avatar[] = [
  {
    id: 'developer',
    name: 'Desenvolvedor',
    description: 'Especialista em programação e arquitetura de sistemas',
    icon: '👨‍💻',
    specialties: ['technical'],
    weaknesses: ['business', 'design'],
    baseBonus: 1
  },
  {
    id: 'analyst',
    name: 'Analista de Negócios',
    description: 'Expert em levantamento de requisitos e processos',
    icon: '📊',
    specialties: ['business', 'documentation'],
    weaknesses: ['technical'],
    baseBonus: 1
  },
  {
    id: 'designer',
    name: 'Designer UX/UI',
    description: 'Focado em experiência do usuário e interfaces',
    icon: '🎨',
    specialties: ['design'],
    weaknesses: ['technical', 'testing'],
    baseBonus: 1
  },
  {
    id: 'tester',
    name: 'Analista de Testes',
    description: 'Especialista em qualidade e testes automatizados',
    icon: '🧪',
    specialties: ['testing'],
    weaknesses: ['design', 'business'],
    baseBonus: 1
  },
  {
    id: 'fullstack',
    name: 'Generalista',
    description: 'Conhecimento amplo mas sem especializações',
    icon: '⚖️',
    specialties: [],
    weaknesses: [],
    baseBonus: 2
  }
];

// Tarefas pré-definidas para o repositório de saberes
const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Levantamento de Requisitos',
    description: 'Definir funcionalidades e escopo do repositório de saberes',
    category: 'business',
    difficulty: 'easy',
    armorClass: 8,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 80,
    createdAt: new Date()
  },
  {
    id: 'task-2',
    name: 'Modelagem do Banco de Dados',
    description: 'Criar diagrama ER e estrutura das tabelas para armazenar conhecimentos',
    category: 'technical',
    difficulty: 'medium',
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
    category: 'technical',
    difficulty: 'hard',
    armorClass: 16,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 180,
    createdAt: new Date()
  },
  {
    id: 'task-4',
    name: 'Criar Interface de Upload',
    description: 'Tela para upload de documentos, vídeos e materiais de conhecimento',
    category: 'design',
    difficulty: 'medium',
    armorClass: 11,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 110,
    createdAt: new Date()
  },
  {
    id: 'task-5',
    name: 'Sistema de Busca e Filtros',
    description: 'Implementar busca textual e filtros por categoria, autor, data',
    category: 'technical',
    difficulty: 'hard',
    armorClass: 18,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 200,
    createdAt: new Date()
  },
  {
    id: 'task-6',
    name: 'Dashboard de Administração',
    description: 'Painel para gestão de conteúdos, usuários e estatísticas',
    category: 'design',
    difficulty: 'medium',
    armorClass: 13,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 140,
    createdAt: new Date()
  },
  {
    id: 'task-7',
    name: 'Sistema de Comentários',
    description: 'Permitir comentários e discussões nos materiais compartilhados',
    category: 'technical',
    difficulty: 'easy',
    armorClass: 9,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 90,
    createdAt: new Date()
  },
  {
    id: 'task-8',
    name: 'Implementar Tags e Categorização',
    description: 'Sistema de tags para organizar e categorizar o conhecimento',
    category: 'business',
    difficulty: 'medium',
    armorClass: 12,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 120,
    createdAt: new Date()
  },
  {
    id: 'task-9',
    name: 'API RESTful',
    description: 'Desenvolver endpoints para integração com outras aplicações',
    category: 'technical',
    difficulty: 'hard',
    armorClass: 15,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 170,
    createdAt: new Date()
  },
  {
    id: 'task-10',
    name: 'Testes Automatizados',
    description: 'Criar suite de testes unitários e de integração',
    category: 'testing',
    difficulty: 'hard',
    armorClass: 17,
    hitPoints: 3,
    currentHp: 3,
    status: 'backlog',
    xpReward: 190,
    createdAt: new Date()
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      character: {
        name: 'Aventureiro',
        avatar: avatars[0],
        level: 1,
        xp: 0,
        xpToNext: 100,
        abilities: ['Iniciante']
      },
      availableAvatars: avatars,
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
            done: 'Concluído'
          };
          
          get().addLog({
            type: 'move',
            message: `"${task.name}" movida para ${statusNames[newStatus]}`
          });
        }

        get().updateTask(id, updates);
      },

      rollDice: (taskCategory) => {
        const { diceType, character } = get();
        const baseRoll = Math.floor(Math.random() * diceType) + 1;
        let totalBonus = character.avatar.baseBonus;

        // Aplicar bônus por especialidade
        if (character.avatar.specialties.includes(taskCategory)) {
          totalBonus += 3; // +3 para especialidades
        }

        // Aplicar penalidade por fraqueza
        if (character.avatar.weaknesses.includes(taskCategory)) {
          totalBonus -= 2; // -2 para fraquezas
        }

        return baseRoll + totalBonus;
      },

      attemptMoveTask: (taskId, newStatus) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return false;

        const roll = get().rollDice(task.category);
        const success = roll >= task.armorClass;
        
        const { character } = get();
        let bonusText = '';
        if (character.avatar.specialties.includes(task.category)) {
          bonusText = ' (Especialidade: +3)';
        } else if (character.avatar.weaknesses.includes(task.category)) {
          bonusText = ' (Fraqueza: -2)';
        }
        
        get().addLog({
          type: 'roll',
          message: success 
            ? `Rolou ${roll}, superou CA ${task.armorClass}! Quest "${task.name}" pode ser movida.${bonusText}`
            : `Rolou ${roll}, falhou contra CA ${task.armorClass}. Quest "${task.name}" resiste!${bonusText}`,
          diceRoll: roll,
          success
        });

        if (success) {
          // Reduzir HP da tarefa
          const newHp = task.currentHp - 1;
          if (newHp <= 0) {
            // Tarefa concluída
            if (newStatus === 'done') {
              get().moveTask(taskId, newStatus);
            } else {
              // Se não está sendo movida para done, apenas move para o próximo status
              get().moveTask(taskId, newStatus);
              get().updateTask(taskId, { currentHp: task.hitPoints }); // Reset HP
            }
          } else {
            get().updateTask(taskId, { currentHp: newHp });
            get().addLog({
              type: 'move',
              message: `"${task.name}" recebeu dano! HP restante: ${newHp}/${task.hitPoints}`
            });
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

      changeAvatar: (avatarId) => {
        const avatar = get().availableAvatars.find(a => a.id === avatarId);
        if (avatar) {
          set((state) => ({
            character: {
              ...state.character,
              avatar
            }
          }));
          
          get().addLog({
            type: 'move',
            message: `Avatar alterado para ${avatar.name}: ${avatar.description}`
          });
        }
      },

      useSpell: () => {
        const { character, spellsUsed } = get();
        if (character.avatar.id === 'mage' && spellsUsed < 3) {
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
