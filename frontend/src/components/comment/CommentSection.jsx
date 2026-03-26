import { useState, useEffect } from 'react'
import { commentService } from '../services/commentService'
import { useAuth } from '../context/AuthContext'
import Avatar from '../common/Avatar'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!videoId) return
    let isMounted = true
    setLoading(true)

    commentService.getVideoComments(videoId)
      .then(res => {
        if (isMounted) setComments(res.data.docs || res.data)
      })
      .catch(err => console.error("Failed to fetch comments", err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })
      
    return () => { isMounted = false }
  }, [videoId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return navigate('/login')
    if (!newComment.trim()) return

    try {
      const res = await commentService.addComment(videoId, newComment)
      // Optimistically add to top of list
      setComments([res.data, ...comments])
      setNewComment('')
    } catch (error) {
      console.error("Failed to post comment", error)
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return
    try {
      await commentService.deleteComment(commentId)
      setComments(comments.filter(c => c._id !== commentId))
    } catch (error) {
      console.error("Failed to delete comment", error)
    }
  }

  if (loading) return <Loader center />

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6">{comments.length} Comments</h3>
      
      {/* Add comment form */}
      <div className="flex gap-4 mb-8">
        <Avatar src={user?.avatar} alt={user?.username} />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-black bg-transparent"
          />
          {newComment && (
            <div className="flex justify-end gap-2 mt-2">
              <button 
                type="button" 
                onClick={() => setNewComment('')}
                className="px-4 py-2 hover:bg-gray-100 rounded-full font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Comment
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <Avatar src={comment.owner?.avatar} alt={comment.owner?.username} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">@{comment.owner?.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{comment.content}</p>
              
              {/* Actions */}
              {user && comment.owner?._id === user._id && (
                <div className="mt-2 flex gap-3">
                  <button 
                    onClick={() => handleDelete(comment._id)}
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
