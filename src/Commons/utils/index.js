const mapThreadComments = (comment) => ({
  id: comment.id,
  username: comment.username,
  createdAt: comment.created_at,
  content: comment.content,
  isDelete: comment.is_delete,
});

const mapThread = (thread) => ({
  id: thread.id,
  title: thread.title,
  body: thread.body,
  createdAt: thread.created_at,
  username: thread.username,
});

const mapCommentReplies = (reply) => ({
  id: reply.id,
  content: reply.content,
  createdAt: reply.created_at,
  isDelete: reply.is_delete,
  username: reply.username,
});

module.exports = {
  mapThreadComments, mapThread, mapCommentReplies,
};
