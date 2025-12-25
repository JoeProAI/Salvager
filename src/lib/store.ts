import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface GatheringJob {
  id: string
  name: string
  resourceType: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress?: number
  createdAt: string
  completedAt?: string
  resultCount?: number
  datasetId?: string
}

export interface Pipeline {
  id: string
  name: string
  description?: string
  steps: PipelineStep[]
  schedule?: string
  enabled: boolean
  lastRun?: string
  nextRun?: string
}

export interface PipelineStep {
  id: string
  type: 'gather' | 'transform' | 'filter' | 'output'
  resourceId?: string
  config: Record<string, any>
}

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  
  // Jobs
  jobs: GatheringJob[]
  addJob: (job: GatheringJob) => void
  updateJob: (id: string, updates: Partial<GatheringJob>) => void
  removeJob: (id: string) => void
  
  // Pipelines
  pipelines: Pipeline[]
  addPipeline: (pipeline: Pipeline) => void
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void
  removePipeline: (id: string) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      
      // Jobs
      jobs: [],
      addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
      updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map((job) => 
          job.id === id ? { ...job, ...updates } : job
        ),
      })),
      removeJob: (id) => set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
      })),
      
      // Pipelines
      pipelines: [],
      addPipeline: (pipeline) => set((state) => ({ 
        pipelines: [...state.pipelines, pipeline] 
      })),
      updatePipeline: (id, updates) => set((state) => ({
        pipelines: state.pipelines.map((p) => 
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
      removePipeline: (id) => set((state) => ({
        pipelines: state.pipelines.filter((p) => p.id !== id),
      })),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'salvager-storage',
      partialize: (state) => ({
        jobs: state.jobs,
        pipelines: state.pipelines,
      }),
    }
  )
)
