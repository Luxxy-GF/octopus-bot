const { get_gas } = require('../utils/octopus/get_gas')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const moment = require('moment')
module.exports = {
    name: "gaschart",
    description: "Get gas consumption",
    aliases: ['gchart'],
    async run(client, message, args){
        const get_from_meter = await get_gas()
        const chart = new ChartJSNodeCanvas({ width: 800, height: 400 })
        const configuration = {
            type: 'line',
            data: {
                labels: get_from_meter.results.map(result => moment(result.interval_start).format('HH:mm')),
                datasets: [
                    {
                        label: 'Gas Consumption',
                        data: get_from_meter.results.map(result => result.consumption),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
        chart.renderToBuffer(configuration).then(buffer => {
            message.reply({ files: [buffer] })
        })
    }
}