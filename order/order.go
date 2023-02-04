package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"order/db"
	"order/queue"
	"time"

	"github.com/google/uuid"
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
	messagesChannel := make(chan []byte)

	connection := queue.Connect()
	queue.StartConsuming(connection, messagesChannel)

	for message := range messagesChannel {
		createOrder(message)
		fmt.Println(string(message))
	}
}

func createOrder(payload []byte) {
	var order Order
	json.Unmarshal(payload, &order)

	order.Uuid = uuid.NewString()
	order.Status = "pendente"
	order.CreatedAt = time.Now()
	saveOrder(order)
}

func saveOrder(order Order) {
	orderJson, _ := json.Marshal(order)
	connection := db.Connect()

	err := connection.Set(context.TODO(), order.Uuid, string(orderJson), 0).Err()
	if err != nil {
		panic(err.Error())
	}
}
