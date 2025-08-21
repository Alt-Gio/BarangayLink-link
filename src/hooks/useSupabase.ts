import { useEffect, useState, useCallback } from 'react'
import { supabase, supabaseHelpers, Database } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

type Project = Database['public']['Tables']['projects']['Row']
type User = Database['public']['Tables']['users']['Row']

export const useSupabase = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [subscriptions, setSubscriptions] = useState<RealtimeChannel[]>([])

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1)
        setIsConnected(!error)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }, [subscriptions])

  // Real-time projects hook
  const useProjects = (includePrivate = false) => {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProjects = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_public', true)
          .eq('is_archived', false)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }, [])

    // Subscribe to real-time updates
    useEffect(() => {
      fetchProjects()

      const subscription = supabaseHelpers.subscribeToProjects((payload) => {
        if (payload.eventType === 'INSERT') {
          setProjects(prev => [payload.new as Project, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setProjects(prev => 
            prev.map(project => 
              project.id === payload.new.id ? payload.new as Project : project
            )
          )
        } else if (payload.eventType === 'DELETE') {
          setProjects(prev => prev.filter(project => project.id !== payload.old.id))
        }
      })

      setSubscriptions(prev => [...prev, subscription])

      return () => {
        subscription.unsubscribe()
      }
    }, [fetchProjects])

    return { projects, loading, error, refetch: fetchProjects }
  }

  // Real-time tasks hook
  const useTasks = (projectId?: string) => {
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTasks = useCallback(async () => {
      try {
        setLoading(true)
        let query = supabase.from('tasks').select('*')
        
        if (projectId) {
          query = query.eq('project_id', projectId)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error
        setTasks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
      } finally {
        setLoading(false)
      }
    }, [projectId])

    useEffect(() => {
      fetchTasks()

      const subscription = supabaseHelpers.subscribeToTasks((payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setTasks(prev => 
            prev.map(task => 
              task.id === payload.new.id ? payload.new : task
            )
          )
        } else if (payload.eventType === 'DELETE') {
          setTasks(prev => prev.filter(task => task.id !== payload.old.id))
        }
      })

      setSubscriptions(prev => [...prev, subscription])

      return () => {
        subscription.unsubscribe()
      }
    }, [fetchTasks])

    return { tasks, loading, error, refetch: fetchTasks }
  }

  // Real-time events hook
  const useEvents = () => {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchEvents = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_public', true)
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })

        if (error) throw error
        setEvents(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      fetchEvents()

      const subscription = supabaseHelpers.subscribeToEvents((payload) => {
        if (payload.eventType === 'INSERT') {
          setEvents(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setEvents(prev => 
            prev.map(event => 
              event.id === payload.new.id ? payload.new : event
            )
          )
        } else if (payload.eventType === 'DELETE') {
          setEvents(prev => prev.filter(event => event.id !== payload.old.id))
        }
      })

      setSubscriptions(prev => [...prev, subscription])

      return () => {
        subscription.unsubscribe()
      }
    }, [fetchEvents])

    return { events, loading, error, refetch: fetchEvents }
  }

  // Real-time announcements hook
  const useAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAnnouncements = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_public', true)
          .eq('status', 'PUBLISHED')
          .order('created_at', { ascending: false })

        if (error) throw error
        setAnnouncements(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch announcements')
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      fetchAnnouncements()

      const subscription = supabaseHelpers.subscribeToAnnouncements((payload) => {
        if (payload.eventType === 'INSERT') {
          setAnnouncements(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setAnnouncements(prev => 
            prev.map(announcement => 
              announcement.id === payload.new.id ? payload.new : announcement
            )
          )
        } else if (payload.eventType === 'DELETE') {
          setAnnouncements(prev => prev.filter(announcement => announcement.id !== payload.old.id))
        }
      })

      setSubscriptions(prev => [...prev, subscription])

      return () => {
        subscription.unsubscribe()
      }
    }, [fetchAnnouncements])

    return { announcements, loading, error, refetch: fetchAnnouncements }
  }

  // User operations
  const getUserByClerkId = useCallback(async (clerkUserId: string) => {
    try {
      return await supabaseHelpers.getUserByClerkId(clerkUserId)
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }, [])

  const createUser = useCallback(async (userData: Database['public']['Tables']['users']['Insert']) => {
    try {
      return await supabaseHelpers.createUser(userData)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }, [])

  const updateUserLastActive = useCallback(async (userId: string) => {
    try {
      return await supabaseHelpers.updateUserLastActive(userId)
    } catch (error) {
      console.error('Error updating user last active:', error)
      throw error
    }
  }, [])

  // Project operations
  const getProjects = useCallback(async () => {
    try {
      return await supabaseHelpers.getProjects()
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }, [])

  const getPublicProjects = useCallback(async () => {
    try {
      return await supabaseHelpers.getPublicProjects()
    } catch (error) {
      console.error('Error fetching public projects:', error)
      throw error
    }
  }, [])

  const createProject = useCallback(async (projectData: Database['public']['Tables']['projects']['Insert']) => {
    try {
      return await supabaseHelpers.createProject(projectData)
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }, [])

  return {
    isConnected,
    supabase,
    supabaseHelpers,
    useProjects,
    useTasks,
    useEvents,
    useAnnouncements,
    getUserByClerkId,
    createUser,
    updateUserLastActive,
    getProjects,
    getPublicProjects,
    createProject,
  }
}

