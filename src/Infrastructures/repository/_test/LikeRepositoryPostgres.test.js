const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const Like = require('../../../Domains/likes/entities/Like');

describe('LikeRepositoryPostgres', () => {
    afterEach(async () => {
        await LikeTableTestHelper.cleanTable();
    })

    afterAll(async () => {
        await pool.end();
    })

    describe('getLikeByCommentIdAnduserId function', () => {
        it('should return like correctly', async () => {
            // Arrange
            const commentId = 'comment-123';
            const userId = 'user-123';
            const id = 'like-123';

            await LikeTableTestHelper.addLike({id, commentId, userId});

            const fakeIdGenerator = () => '123'; // stub!
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            const expectedLike = new Like({
                id,
                commentId,
                userId,
            })

            // Action
            const like = await likeRepositoryPostgres.getLikeByCommentIdAnduserId('comment-123', 'user-123');

            // Assert
            expect(like).toBeDefined();
            expect(like).toStrictEqual(expectedLike);
        })

        it('should return null when like not found', async () => {
            // Arrange
            const fakeIdGenerator = () => '123'; // stub!
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const like = await likeRepositoryPostgres.getLikeByCommentIdAnduserId('commnet-123', 'user-123');

            // Assert
            expect(like).toBeNull();
        })
    });

    describe('createLike function', () => {
        it('should persist like and return id', async () => {
            // Arrange
            const commentId = 'comment-123';
            const userId = 'user-123';

            const fakeIdGenerator = () => '123'; // stub!
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const likeId = await likeRepositoryPostgres.createLike(commentId, userId);

            // Assert
            expect(likeId).toBe('like-123');
        })
    })

    describe('deleteLike function', () => {
        it('should delete like correctly', async () => {
            // Arrange
            await LikeTableTestHelper.addLike({});

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, null);

            // Action
            const likeId = await likeRepositoryPostgres.deleteLike('comment-123', 'user-123');

            // Assert
            expect(likeId).toBe('like-123');
        })
    })

    describe('countLikeByCommentId function', () => {
        it('should return 0 if comment not liked', async () => {
            // Arrange
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, null);

            // Action
            const likeCount = await likeRepositoryPostgres.countLikeByCommentId('comment-123');
            
            // Assert
            expect(likeCount).toBe(0);
        })

        it('should return 1 if comment liked once', async () => {
            // Arrange
            await LikeTableTestHelper.addLike({});
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, null);

            // Action
            const likeCount = await likeRepositoryPostgres.countLikeByCommentId('comment-123');

            // Assert
            expect(likeCount).toBe(1);
        })
    })

});