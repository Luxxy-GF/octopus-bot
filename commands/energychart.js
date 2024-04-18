const { get_electricity } = require('../utils/octopus/get_electricity')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const moment = require('moment')
module.exports = {
    name: "energychart",
    description: "Get electricity consumption",
    aliases: ['echart'],
    async run(client, message, args){
        const get_from_meter = await get_electricity()
        const chart = new ChartJSNodeCanvas({ width: 800, height: 400 })
        const configuration = {
            type: 'line',
            data: {
                labels: get_from_meter.results.map(result => moment(result.interval_start).format('HH:mm')),
                datasets: [
                    {
                        label: 'Electricity Consumption',
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