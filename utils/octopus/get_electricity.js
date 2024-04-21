const axios = require("axios");

async function get_electricity(pageSize = 48) {
    try {
        return (
            await axios({
                methed: "get",
                url: `${config.octopus.url}/electricity-meter-points/${config.mater.electricity.MPAN}/meters/${config.mater.electricity.SERIAL}/consumption?page_size=${pageSize}`,
                auth: {
                    username: config.octopus.apiKey
                }
            })
        ).data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { get_electricity };
