// Libraries
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const { toNanoDate } = require("influx")
const axios = require('axios');
const config = require('../../config.json');
function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
    msleep(n * 1000);
}
const
    OCTO_API_KEY = config.octopus.apiKey,
    OCTO_ELECTRIC_SN = config.mater.electricity.SERIAL,
    OCTO_ELECTRIC_MPAN = config.mater.electricity.MPAN,
    OCTO_GAS_MPRN = config.mater.gas.MPRN,
    OCTO_GAS_SN = config.mater.gas.SERIAL,
    OCTO_ELECTRIC_COST = "24.66"
    OCTO_GAS_COST = "6.13"
    INFLUXDB_URL = config.influx.url,
    INFLUXDB_TOKEN = config.influx.token,
    INFLUXDB_ORG = config.influx.org,
    INFLUXDB_BUCKET = config.influx.bucket,
    LOOP_TIME = 600,
    PAGE_SIZE = 48,
    VOLUME_CORRECTION = 1.02264,
    CALORIFIC_VALUE = 37.5,
    JOULES_CONVERSION = 3.6

const boot = async () => {
    while (true) {
        // Set up influx client
        const influxclient = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN })
        const writeApi = influxclient.getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET)
        writeApi.useDefaultTags({ app: 'octopus-energy-consumption-metrics' })
        console.log("Polling data from octopus API")

        // Retrieve data from octopus API
        let electricresponse = null;
        let gasresponse = null;
        try {
            let options = {
                auth: {
                    username: OCTO_API_KEY
                }
            }
            electricresponse = await axios.get(`https://api.octopus.energy/v1/electricity-meter-points/${OCTO_ELECTRIC_MPAN}/meters/${OCTO_ELECTRIC_SN}/consumption?page_size=${PAGE_SIZE}`, options)
            gasresponse = await axios.get(`https://api.octopus.energy/v1/gas-meter-points/${OCTO_GAS_MPRN}/meters/${OCTO_GAS_SN}/consumption?page_size=${PAGE_SIZE}`, options)


        } catch (e) {
            console.log("Error retrieving data from octopus API")
            console.log(e)
        }

        // Now we loop over every result given to us from the API and feed that into influxdb

        for await (obj of electricresponse.data.results) {
            // Here we take the end interval, and convert it into nanoseconds for influxdb as nodejs works with ms, not ns
            const ts = new Date(obj.interval_end)
            const nanoDate = toNanoDate(String(ts.valueOf()) + '000000')

            // work out the consumption and hard set the datapoint's timestamp to the interval_end value from the API
            let electricpoint = new Point('electricity')
                .floatField('consumption', Number(obj.consumption))
                .timestamp(nanoDate)

            // Same again but for cost mathmatics
            let electriccost = Number(obj.consumption) * Number(OCTO_ELECTRIC_COST) / 100
            let electriccostpoint = new Point('electricity_cost')
                .floatField('price', electriccost)
                .timestamp(nanoDate)

            // and then write the points:
            writeApi.writePoint(electricpoint)
            writeApi.writePoint(electriccostpoint)
        }

        // Repeat the above but for gas
        for await (obj of gasresponse.data.results) {
            const ts = new Date(obj.interval_end)
            const nanoDate = toNanoDate(String(ts.valueOf()) + '000000')

            let gaspoint = new Point('gas')
                .floatField('consumption', Number(obj.consumption))
                .timestamp(nanoDate)

            let kilowatts = (Number(obj.consumption) * Number(VOLUME_CORRECTION) * Number(CALORIFIC_VALUE)) / Number(JOULES_CONVERSION)

            let gaskwhpoint = new Point('gaskwh')
                .floatField('consumption_kwh', Number(kilowatts))
                .timestamp(nanoDate)

            let gascost = Number(kilowatts) * Number(OCTO_GAS_COST) / 100

            let gascostpoint = new Point('gas_cost')
                .floatField('price', gascost)
                .timestamp(nanoDate)

            writeApi.writePoint(gaspoint)
            writeApi.writePoint(gaskwhpoint)
            writeApi.writePoint(gascostpoint)

        }

        await writeApi
            .close()
            .then(() => {
                console.log('Octopus API response submitted to InfluxDB successfully')
            })
            .catch(e => {
                console.error(e)
                console.log('Error submitting data to InfluxDB')
            })

        // Now sleep for the loop time
        console.log("Sleeping for: " + LOOP_TIME)
        sleep(Number(LOOP_TIME))
    }
}

boot((error) => {
    if (error) {
        console.error(error)
        throw (error.message || error)
    }
});