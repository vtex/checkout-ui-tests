## Accounts in which tests should cover

|                 | `vtexgame1` | `vtexgame1geo` | `vtexgame1nolean` | `vtexgame1clean` | `vtexgame1invoice` |
| --------------- | ----------- | -------------- | ----------------- | ---------------- | ------------------ |
| Lean Shipping   | true        | true           | false             | false            | true               |
| Geolocation     | false       | true           | false             | false            | false              |
| Google Maps Key | true        | true           | false             | false            | false              |
| Invoice Address | false       | false          | false             | false            | true               |

## Shipping Purchase Scenarios

### Delivery (Payment: Credit card)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Delivery%20-%20Credit%20card.model.js)
- [Second Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Delivery%20-%20Second%20Purchase%20-%20Credit%20card.model.js)

### Delivery (Payment: Boleto)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Delivery%20-%20Boleto.model.js)
- Second Purchase

### Delivery + Pickup (Payment: Credit card)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Pickup_Delivery%20-%20Credit%20card.model.js)
- Second Purchase

### Delivery + Scheduled Delivery (Payment: Credit card)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Delivery_Scheduled%20Delivery%20-%20Credit%20card.model.js)
- [Second Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Delivery_Scheduled%20Delivery%20-%20Second%20Purchase%20-%20Credit%20card.model.js)

### Delivery + Scheduled Pickup (Payment: Credit card)

- First Purchase
- Second Purchase

### Pickup (Payment: Credit card)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Pickup%20-%20Credit%20card.model.js)
- [Second Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Pickup%20-%20Second%20Purchase%20-%20Credit%20card.model.js)

### Pickup + Scheduled Delivery (Payment: Credit card)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Pickup_Scheduled%20Delivery%20-%20Credit%20card.model.js)
- [Second Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Pickup_Scheduled%20Delivery%20-%20Second%20Purchase%20-%20Boleto.model.js)

### Pickup + Scheduled Pickup (Payment: Credit card)

- First Purchase
- Second Purchase

### Scheduled Delivery (Payment: Credit card)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Scheduled%20Delivery%20-%20Credit%20card.model.js)
- [Second Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Scheduled%20Delivery%20-%20Second%20Purchase%20-%20Credit%20card.model.js)

### Scheduled Delivery + Scheduled Pickup (Payment: Credit card)

- First Purchase
- Second Purchase

### Delivery + Scheduled Delivery + Pickup (Payment: Credit card)

### Delivery + Scheduled Delivery + Scheduled Pickup (Payment: Credit card)

### Delivery + Scheduled Pickup + Pickup (Payment: Credit card)

### Scheduled Delivery + Scheduled Pickup + Pickup (Payment: Credit card)

## Other Purchase Scenarios

### Gift List (Payment: Boleto)

- [First Purchase](https://github.com/vtex/checkout-ui-tests/blob/master/tests/shipping/Black%20Box/models/Gift%20List%20Purchase.model.js)
- Second Purchase
