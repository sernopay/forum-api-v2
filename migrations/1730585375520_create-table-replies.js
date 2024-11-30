/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        deleted_at: {
            type: 'TIMESTAMP',
            notNull: false,
        },
        deleted_by: {
            type: 'VARCHAR(50)',
            notNull: false,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('replies');
};
