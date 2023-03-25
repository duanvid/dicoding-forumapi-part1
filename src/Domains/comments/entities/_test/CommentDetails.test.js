const CommentDetails = require('../CommentDetails')

describe('Comment Details entities', () => {
    it('should throw error if not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            username: 'dicoding',
            date: new Date(),
            replies: [],
        }

        // Action and Assert
        expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it('should throw error if payload not contain correct data type', () => {
        // Arrange
        const payload = {
            id: 123,
            username: ['dicoding'],
            created_at: new Date(),
            content: 123
        }

        // Action and Assert
        expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_CORRECT_DATA_TYPE');
    });

    it('should create CommentDetails object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            username: 'dicoding',
            created_at: new Date().toDateString(),
            content: 'thread comment'
        }

        // Action
        const { id, username, date, content } = new CommentDetails(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username)
        expect(date).toEqual(payload.created_at);
        expect(content).toEqual(payload.content);
    })
})