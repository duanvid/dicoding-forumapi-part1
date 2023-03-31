/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumns(
    'comments',
    {
      is_delete: {
        type: 'BOOLEAN',
      },
      thread_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      created_at: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
    },
  );
  pgm.addColumns(
    'threads',
    {
      created_at: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
    },
  );
  pgm.addConstraint('comments', 'fk_comments.thread_id_to_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('threads', 'fk_threads.owner_to_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.owner_to_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.owner_to_users.id');
  pgm.dropConstraint('threads', 'fk_threads.owner_to_users.id');
  pgm.dropConstraint('comments', 'fk_comments.thread_id_to_threads.id');
  pgm.dropColumns('threads', ['created_at']);
  pgm.dropColumns('comments', ['is_delete', 'thread_id', 'created_at']);
};
