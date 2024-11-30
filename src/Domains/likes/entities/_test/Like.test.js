const Like = require('../Like');

describe('like entities', () => {
    it('should create like correctly', () => {
        // Arrange
        const payload = {
            id: 'like-123',
            commentId: 'comment-123',
            userId: 'user-123',
        }

        // Action
        const like = new Like(payload);

        // Assert
        expect(like.id).toEqual(payload.id);
        expect(like.commentId).toEqual(payload.commentId);
        expect(like.userId).toEqual(payload.userId);
    })
})