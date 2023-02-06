package main

import (
	"encoding/json"
	"payment/queue"
	"time"

	"github.com/streadway/amqp"
)

type Order struct {
	Uuid      string    `json:"uuid"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	ProductId string    `json:"productId"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at,string"`
}

func main() {
	ordersChannel := make(chan []byte)

	connection := queue.Connect()
	queue.StartConsuming("order", connection, ordersChannel)

	var order Order
	for payload := range ordersChannel {
		json.Unmarshal(payload, &order)
		order.Status = "aprovado"
		notifyPaymentProcessed(order, connection)
	}
}

func notifyPaymentProcessed(order Order, channel *amqp.Channel) {
	orderJson, err := json.Marshal(order)
	if err != nil {
		panic(err.Error())
	}

	queue.Notify(orderJson, "payment", "", channel)
}
