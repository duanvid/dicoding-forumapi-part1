class ThreadRepository {
    async addThread(newThread, credentialId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyThreadId(threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = ThreadRepository