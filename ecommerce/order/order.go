package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"order/db"
	"order/queue"
	"time"

	"github.com/google/uuid"
	"github.com/streadway/amqp"
)

type Product struct {
	Uuid    string  `json:"uuid"`
	Product string  `json:"product"`
	Price   float64 `json:"price,string"`
}

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
	var param string
	flag.StringVar(&param, "opt", "", "Usage")
	flag.Parse()

	messagesChannel := make(chan []byte)
	connection := queue.Connect()

	switch param {
	case "checkout":
		queue.StartConsuming("checkout", connection, messagesChannel)

		for message := range messagesChannel {
			order := createOrder(message)
			notifyCreatedOrder(order, connection)
			fmt.Println("Send order: ", order)
		}
	case "payment":
		queue.StartConsuming("payment", connection, messagesChannel)

		var order Order
		for message := range messagesChannel {
			json.Unmarshal(message, &order)
			saveOrder(order)
			fmt.Println("Receive processed order: ", order)
		}
	}

}

func createOrder(payload []byte) Order {
	var order Order
	json.Unmarshal(payload, &order)

	order.Uuid = uuid.NewString()
	order.Status = "pendente"
	order.CreatedAt = time.Now()
	saveOrder(order)
	return order
}

func saveOrder(order Order) {
	orderJson, _ := json.Marshal(order)
	connection := db.Connect()

	err := connection.Set(context.TODO(), order.Uuid, string(orderJson), 0).Err()
	if err != nil {
		panic(err.Error())
	}
}

func notifyCreatedOrder(order Order, channel *amqp.Channel) {
	orderJson, err := json.Marshal(order)
	if err != nil {
		panic(err.Error())
	}

	queue.Notify(orderJson, "order", "", channel)
}
