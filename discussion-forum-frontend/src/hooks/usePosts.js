import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPosts, getPost, createPost, deletePost, upvotePost, downvotePost } from '../api/postsApi'

export function usePosts(params) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params).then((res) => res.data),
  })
}

export function usePost(id) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id).then((res) => res.data),
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => createPost(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deletePost(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useUpvotePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => upvotePost(id).then((res) => res.data),
    onSuccess: (_, id) => queryClient.invalidateQueries({ queryKey: ['post', id] }),
  })
}

export function useDownvotePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => downvotePost(id).then((res) => res.data),
    onSuccess: (_, id) => queryClient.invalidateQueries({ queryKey: ['post', id] }),
  })
}
