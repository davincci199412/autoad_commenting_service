const sleep = (delay) => {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

const setUserInfo = (request) => {
    const getUserInfo = {
        _id: request._id,
        username: request.username,
        userId: request.userId,
        role: request.role
    };

    return getUserInfo;
};

module.exports = {
    sleep,
    setUserInfo
}