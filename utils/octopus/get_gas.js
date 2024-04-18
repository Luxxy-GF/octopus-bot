const axios = require("axios");

async function get_gas() {
    try {
        return (
            await axios({
                methed: "get",
                url: `${config.octopus.url}/gas-meter-points/${config.mater.gas.MPRN}/meters/${config.mater.gas.SERIAL}/consumption/`,
                auth: {
                    username: config.octopus.apiKey
                }
            })
        ).data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { get_gas };
