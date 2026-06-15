import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, addComment, editComment, deleteComment, replyToComment, upvoteComment } from '../api/commentsApi'

export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId).then((res) => res.data),
    enabled: !!postId,
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, content }) => addComment(postId, content).then((res) => res.data),
    onSuccess: (_data, variables) => queryClient.invalidateQueries({ queryKey: ['comments', String(variables.postId)] }),
  })
}

export function useEditComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, content }) => editComment(commentId, content).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  })
}

export function useReplyToComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, content }) => replyToComment(commentId, content).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  })
}

export function useUpvoteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId) => upvoteComment(commentId).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  })
}
