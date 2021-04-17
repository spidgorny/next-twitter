module.exports = {
	future: {
		webpack5: true,
	},
	async headers() {
		return [
			{
				source: "/api/:all",
				headers: [
					{
						key: "cache-control",
						value: "public maxage=3600",
					},
				],
			},
		];
	},
};
