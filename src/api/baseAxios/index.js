// axios 的封装
/****
 * 主要功能：
 * 1. 创建 axios 实例
 * 2. 添加请求拦截器
 * 3. 添加响应拦截器
 * 4. 添加错误处理
 * 5. 添加取消请求
 * 6. 添加重试请求
 * 7. 添加请求缓存
 * 8. 请求方法的封装
 */
import axios from 'axios';
import ApiError from './errorDeal';
import { to } from './util';

// 生成请求唯一标识
function generateRequestKey(config) {
    const { url, method, params, data } = config;
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

class AxiosFn {
    instance = {};
    config = {};
    pendingRequests = new Map(); // 用于存储请求的取消函数
    constructor(config) {
        this.config = Object.assign(config, {
            // 默认配置
            baseURL: import.meta.env.VITE_APP_BASE_API,
            timeout: 10000
        });
        this.init();
    }

    // 添加请求到 pendingRequests
    addPendingRequest(config) {
        const requestKey = generateRequestKey(config);
        const controller = new AbortController();
        config.signal = controller.signal;
        if (this.pendingRequests.has(requestKey)) {
            // 如果请求已经存在，则取消之前的请求
            this.pendingRequests.get(requestKey)?.abort();
            this.pendingRequests.delete(requestKey);
        }
        this.pendingRequests.set(requestKey, controller);
    }

    // 移除请求
    removePendingRequest(requestKey) {
        if (this.pendingRequests.has(requestKey)) {
            // 如果请求已经存在，则取消之前的请求
            this.pendingRequests.get(requestKey)?.abort();
            this.pendingRequests.delete(requestKey);
        }
    }

    // 错误提示
    showErrorMsg(config, error) {
        // 业务错误提示
        const isShowMsg = !!config?.isDefaultShowMsg;
        if (isShowMsg) {
            ElMessage.error(error.message);
        }
    }

    init = () => {
        this.instance = axios.create(this.config);
        // 请求拦截
        this.instance.interceptors.request.use(
            (config) => {
                console.log(config, 676);
                // 添加请求到 pendingRequests
                this.addPendingRequest(config);

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        // 响应拦截
        this.instance.interceptors.response.use(
            (response) => {
                // 移除请求
                this.removePendingRequest(generateRequestKey(response.config));
                const { code } = response.data;
                console.log(response, 999);
                try {
                    if (response && response.status === 200) {
                        if (response.data) {
                            if (code === 0) {
                                // 成功
                                console.log(response?.data, 33333);
                                return response?.data;
                            } else {
                                // 根据具体业务code，自定义错误处理
                                throw new ApiError(code, response.data.msg);
                            }
                        } else {
                            throw new ApiError(200, '接口返回数据为空');
                        }
                    } else {
                        throw new ApiError(0, '抱歉出错了');
                    }
                } catch (error) {
                    // 业务错误的提示控制
                    this.showErrorMsg(response.config, error);
                    throw error;
                }
            },
            (error) => {
                console.log(error);
                let errorInstance = null;
                if (error.name === 'AbortError') {
                    // 请求被取消
                    errorInstance = Promise.reject(new ApiError(0, '请求被取消'));
                } else {
                    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                    if (error.response) {
                        this.removePendingRequest(generateRequestKey(error.config));
                        errorInstance = ApiError.createBuiltInApiError(error.response.status);
                    } else {
                        // 响应错误
                        let defaultErrorMsg = '请求出错了';
                        if (
                            error.code === 'ECONNABORTED' ||
                            error.message === 'Network Error' ||
                            error.message.includes('timeout')
                        ) {
                            defaultErrorMsg = '请求超时';
                        }
                        errorInstance = new ApiError(
                            0,
                            `接口${error.config?.url}请求问题;msg: ${error.message || defaultErrorMsg}`
                        );
                    }
                }
                // 如果是服务器错误 / 没有返回   直接提示  不需要进行判断
                ElMessage.error(errorInstance.message);
                return Promise.reject(errorInstance);
            }
        );
    };

    get(
        url,
        params,
        { withCredentials = true, headers = {}, isDefaultShowMsg } = {}
    ) {
        return to(
            this.instance.get(url, {
                params,
                withCredentials,
                headers,
                isDefaultShowMsg
            })
        );
    }
    post(
        url,
        data,
        { withCredentials = true, headers = {}, isDefaultShowMsg } = {}
    ) {
        return to(
            this.instance.post(url, data, {
                withCredentials,
                headers,
                isDefaultShowMsg
            })
        );
    }

    // 取消单次请求
    cancelSingleRequest(config) {
        const requestKey = generateRequestKey(config);
        this.removePendingRequest(requestKey);
    }

    // 取消全部请求
    cancelAllRequests() {
        this.pendingRequests.forEach((controller) => {
            controller.abort();
        });
        this.pendingRequests.clear();
    }
}

const axiosInstance = new AxiosFn({});
// 可多实例，甚至可以多实例加参数判断，进行内部逻辑差异化封装处理 -- 暂时不整
export default axiosInstance;
