const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        method: handler.postThreadsHandler,
    },
])

module.exports = routes;
