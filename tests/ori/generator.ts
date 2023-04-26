const fs = require('fs')

const accounts = JSON.parse(fs.readFileSync('test-accounts.json', 'utf8'))

const ceps = JSON.parse(fs.readFileSync('ceps.json', 'utf8'))

type Data = {
  items: Item[]
  destinationCEP: string[]
}

type Item = {
  sku: string
  qty: number
}

const account = accounts['fulfillmentqa'] as string[]

const processedData = new Array<Data>()

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1
}

const count = ceps.length

account.forEach((element) => {
  const item = new Array<Item>()

  item.push({
    sku: element,
    qty: getRandomInt(5),
  })

  processedData.push({
    items: item,
    destinationCEP: [ceps[getRandomInt(count)]],
  })
})

console.log(JSON.stringify(processedData))
