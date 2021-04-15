const json = await fetch(url.toString(), {
	headers: {
		Authorization: await this.credentials.authorizationHeader(url, {
			method: "GET",
		}),
	},
}).then(async (response: Response) => {
	console.log(response);
	const contentType = response.headers.get("content-type");
	if (contentType && contentType.indexOf("application/json") !== -1) {
		return {
			data: await response.json(),
			headers: Object.fromEntries(response.headers.entries()),
		};
	} else {
		return {
			text: await response.text(),
			header: Object.fromEntries(response.headers.entries()),
		};
	}
});
