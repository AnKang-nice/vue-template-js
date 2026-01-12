export function to(request) {
    // 判断是不是一个promise
    return request instanceof Promise
        ? request
            .then((res) => {
                console.log(res, 'res');
                return { data: res, error: null };
            })
            .catch((error) => {
                return { data: null, error };
            })
        : { data: request, error: null };
}
