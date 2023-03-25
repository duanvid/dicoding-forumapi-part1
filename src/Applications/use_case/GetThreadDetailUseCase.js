class GetThreadDetailUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository
    }

    async execute(payload) {
        await this._threadRepository.verifyThreadId(payload);
        return await this._threadRepository.getThreadById(payload)
    }
}

module.exports = GetThreadDetailUseCase;