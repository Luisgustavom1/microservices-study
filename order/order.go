package main

import (
	"fmt"
	"order/queue"
	"os"
	"time"
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
		fmt.Println(string(message))
	}
}
