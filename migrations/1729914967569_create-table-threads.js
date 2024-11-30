/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        title: {
          type: 'VARCHAR(255)',
          notNull: true,
        },
        body: {
          type: 'TEXT',
          notNull: true,
        },
        owner: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        created_at: {
          type: 'TIMESTAMP',
          notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('threads');
};
