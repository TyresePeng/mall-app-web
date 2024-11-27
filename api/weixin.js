import request from '@/utils/requestUtil'
export function weixinLogin(data) {
	return request({
		method: 'POST',
		url: '/weixin/login',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}
