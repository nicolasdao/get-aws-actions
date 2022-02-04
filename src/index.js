/**
 * Copyright (c) 2019-2022, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const https = require('https')

const DB = 'https://awspolicygen.s3.amazonaws.com/js/policies.js'
const BACKUP_DB = 'https://gist.githubusercontent.com/nicolasdao/95e6891bc4681b5424d47d6926c33fee/raw/cab16c30a1a6246396fedc339fcf33faccf6b232/actions.js'

const httpGet = url => new Promise((next, fail) => https.get(url, res => {
	let data = []
	
	res.on('data', chunk => {
		data.push(chunk)
	})

	res.on('end', () => {
		const { serviceMap } = JSON.parse(Buffer.concat(data).toString().replace(/^(.*?){/,'{')) || {}
		const actions = []
		Object.entries(serviceMap||{}).map(([service, value]) => {
			const { StringPrefix, Actions } = value||{}
			if (service && StringPrefix && Actions && Actions.length) {
				actions.push(...Actions.map(a => {
					const name = `${StringPrefix}:${a}`
					return {
						service,
						name,
						textSearch: `${service} - ${name}`.toLowerCase()
					}
				}))
			}
		})

		next(actions)
	})
}).on('error', err => {
	fail(err)
}))

const awsActions = httpGet(DB).catch(() => null).then(data => {
	if (data && data.length)
		return data

	return httpGet(BACKUP_DB)
})

module.exports = {
	aws: {
		actions: awsActions
	}
}