import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_user_id: string
          name: string
          email: string
          position: string
          role: 'ADMIN' | 'BARANGAY_CAPTAIN' | 'SECRETARY' | 'TREASURER' | 'COUNCILOR' | 'STAFF'
          employee_id: string | null
          phone_number: string | null
          profile_image: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          last_active_at: string | null
        }
        Insert: {
          id?: string
          clerk_user_id: string
          name: string
          email: string
          position: string
          role: 'ADMIN' | 'BARANGAY_CAPTAIN' | 'SECRETARY' | 'TREASURER' | 'COUNCILOR' | 'STAFF'
          employee_id?: string | null
          phone_number?: string | null
          profile_image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_active_at?: string | null
        }
        Update: {
          id?: string
          clerk_user_id?: string
          name?: string
          email?: string
          position?: string
          role?: 'ADMIN' | 'BARANGAY_CAPTAIN' | 'SECRETARY' | 'TREASURER' | 'COUNCILOR' | 'STAFF'
          employee_id?: string | null
          phone_number?: string | null
          profile_image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_active_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          status: 'PLANNING' | 'PENDING_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
          start_date: string | null
          due_date: string | null
          completed_date: string | null
          budget: number | null
          expenditure: number | null
          category: 'INFRASTRUCTURE' | 'HEALTH' | 'EDUCATION' | 'ENVIRONMENT' | 'SOCIAL' | 'DISASTER' | 'AGRICULTURE' | 'YOUTH' | 'SENIOR' | 'SPORTS' | 'CULTURAL' | 'TECHNOLOGY' | 'GOVERNANCE' | 'PEACE_ORDER' | 'OTHERS'
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL'
          objectives: string | null
          beneficiaries: string | null
          location: string | null
          methodology: string | null
          expected_outcome: string | null
          metadata: any | null
          is_public: boolean
          is_archived: boolean
          progress_percentage: number
          milestones: any | null
          manager_id: string
          created_by_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          status?: 'PLANNING' | 'PENDING_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          budget?: number | null
          expenditure?: number | null
          category: 'INFRASTRUCTURE' | 'HEALTH' | 'EDUCATION' | 'ENVIRONMENT' | 'SOCIAL' | 'DISASTER' | 'AGRICULTURE' | 'YOUTH' | 'SENIOR' | 'SPORTS' | 'CULTURAL' | 'TECHNOLOGY' | 'GOVERNANCE' | 'PEACE_ORDER' | 'OTHERS'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL'
          objectives?: string | null
          beneficiaries?: string | null
          location?: string | null
          methodology?: string | null
          expected_outcome?: string | null
          metadata?: any | null
          is_public?: boolean
          is_archived?: boolean
          progress_percentage?: number
          milestones?: any | null
          manager_id: string
          created_by_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          status?: 'PLANNING' | 'PENDING_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
          start_date?: string | null
          due_date?: string | null
          completed_date?: string | null
          budget?: number | null
          expenditure?: number | null
          category?: 'INFRASTRUCTURE' | 'HEALTH' | 'EDUCATION' | 'ENVIRONMENT' | 'SOCIAL' | 'DISASTER' | 'AGRICULTURE' | 'YOUTH' | 'SENIOR' | 'SPORTS' | 'CULTURAL' | 'TECHNOLOGY' | 'GOVERNANCE' | 'PEACE_ORDER' | 'OTHERS'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL'
          objectives?: string | null
          beneficiaries?: string | null
          location?: string | null
          methodology?: string | null
          expected_outcome?: string | null
          metadata?: any | null
          is_public?: boolean
          is_archived?: boolean
          progress_percentage?: number
          milestones?: any | null
          manager_id?: string
          created_by_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table types as needed...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper functions for common operations
export const supabaseHelpers = {
  // User operations
  async getUserByClerkId(clerkUserId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single()
    
    if (error) throw error
    return data
  },

  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateUserLastActive(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Project operations
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        manager:users!projects_manager_id_fkey(*),
        team:project_team(*),
        created_by:users!projects_created_by_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getPublicProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        manager:users!projects_manager_id_fkey(*)
      `)
      .eq('is_public', true)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createProject(projectData: Database['public']['Tables']['projects']['Insert']) {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select(`
        *,
        manager:users!projects_manager_id_fkey(*),
        team:project_team(*),
        created_by:users!projects_created_by_id_fkey(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Real-time subscriptions
  subscribeToProjects(callback: (payload: any) => void) {
    return supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
      .subscribe()
  },

  subscribeToTasks(callback: (payload: any) => void) {
    return supabase
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
      .subscribe()
  },

  subscribeToEvents(callback: (payload: any) => void) {
    return supabase
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, callback)
      .subscribe()
  },

  subscribeToAnnouncements(callback: (payload: any) => void) {
    return supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, callback)
      .subscribe()
  }
}

export default supabase

