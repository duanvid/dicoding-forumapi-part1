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

module.exports = { mapThreadComments, mapThread };
