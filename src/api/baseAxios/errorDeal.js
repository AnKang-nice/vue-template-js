const ErrorDic = {
	400: '错误的请求',
	401: '未授权，请登录',
	403: '服务器拒绝访问',
	404: '服务器未找到资源',
	408: '请求超时',
	500: '服务器内部错误',
	502: '网关错误',
	503: '服务不可用',
	504: '网关超时'
};
/**
 * 安全的code
 * 0 ｜ 200 无问题
 * 1000 因操作导致的问题   // 具体看约定
 * 1005 未登录
 * 1009 没有角色
 */
export const SUCCESS = 0;
export const SAFE_CODE = [200, 1000, 1005, 1009];

export class ApiError {
	constructor(
		code = 0,
		message = ''
	) {
		super(message);
		this.name = this.constructor.name;
	}

	static createBuiltInApiError(statusCode) {
		const message = ErrorDic[statusCode];
		if (message) {
			return new ApiError(statusCode, message);
		} else {
			return new ApiError(statusCode, '抱歉出错了');
		}
	}
}

export default ApiError;
