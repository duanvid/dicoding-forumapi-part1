const AddRepliesUseCase = require('../../../../Applications/use_case/AddRepliesUseCase');
const DeleteRepliesUseCase = require('../../../../Applications/use_case/DeleteRepliesUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postRepliesHandler = this.postRepliesHandler.bind(this);
    this.deleteRepliesHandler = this.deleteRepliesHandler.bind(this);
  }

  async postRepliesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const addRepliesUseCase = this._container.getInstance(AddRepliesUseCase.name);
    const addedReply = await addRepliesUseCase.execute({
      useCasePayload: request.payload, credentialId, useCaseParameter: request.params,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteRepliesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteRepliesUseCase = this._container.getInstance(DeleteRepliesUseCase.name);
    const useCaseParameters = {
      threadId,
      userId: credentialId,
      commentId,
      replyId,
    };
    await deleteRepliesUseCase.execute(useCaseParameters);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus balasan',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
