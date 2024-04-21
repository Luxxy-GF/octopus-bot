const axios = require("axios");

async function get_gas(pageSize = 48) {
    try {
        return (
            await axios({
                methed: "get",
                url: `${config.octopus.url}/gas-meter-points/${config.mater.gas.MPRN}/meters/${config.mater.gas.SERIAL}/consumption?page_size=${pageSize}`,
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
