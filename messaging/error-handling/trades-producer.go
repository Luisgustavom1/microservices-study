package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

func main() {
	url := os.Getenv("NATS_URL")
	if url == "" {
		url = nats.DefaultURL
	}

	nc, _ := nats.Connect(url)
	defer nc.Drain()

	js, _ := jetstream.New(nc)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tradesOrder := []string{
		"12654A87FR4,BUY,AAPL,1254",
		"87R54E3068U,BUY,AAPL,3122",
		"6R4NB7609JJ,BUY,AAPL,5433",
		"2WE35HF6DHF,BUY,AAPL,8756 SHARES",
		"764980974R2,BUY,AAPL,1211",
		"764980974R2,BUY,AAPL",
	}

	for i := 0; i < 6; i++ {
		js.PublishMsg(ctx, &nats.Msg{
			Subject: fmt.Sprintf("trade.%s"),
			Data:    []byte(tradesOrder[i%len(tradesOrder)]),
			Header: nats.Header{
				"trade-id": []string{string(i)},
			},
		})
	}
}
