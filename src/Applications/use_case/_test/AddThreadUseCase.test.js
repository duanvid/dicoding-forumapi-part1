describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'thread-title',
            body: 'thread-body',
        };

        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: 'thread-title',
            owner: 'user-123'
        });
    })
})