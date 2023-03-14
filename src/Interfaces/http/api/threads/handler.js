const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadsHandler = this.postThreadsHandler.bind(this);
    }

    async postThreadsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
        const addedThread = await addThreadUseCase.execute(request.payload, credentialId)

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            }
        })
        response.code(201);
        return response
    }
}

module.exports = ThreadsHandler;